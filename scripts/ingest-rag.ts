import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { neon } from '@neondatabase/serverless';
import { embedMany } from 'ai';
import { listCorpus } from '../lib/corpus';
import { EMBEDDING_MODEL } from '../lib/rag';

const PARSER_VERSION='rag-v3-corpus-lifecycle';
const MAX_CHARS=3200;
const OVERLAP=350;

type JsonObject=Record<string,unknown>;
type ExplicitNode={type:string;label:string;properties:JsonObject};
type ExplicitRelationship={subject:string;subjectType:string;predicate:string;object:string;objectType:string;confidence:number;properties:JsonObject};

function hash(v:string){return crypto.createHash('sha256').update(v).digest('hex')}
function norm(v:string){return v.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ')}
function arr(v:unknown):string[]{return Array.isArray(v)?v.map(String).map(x=>x.trim()).filter(Boolean):typeof v==='string'?v.split(/[,;|]/).map(x=>x.trim()).filter(Boolean):[]}
function obj(v:unknown):JsonObject{return v&&typeof v==='object'&&!Array.isArray(v)?v as JsonObject:{}}
function objects(v:unknown):JsonObject[]{return Array.isArray(v)?v.map(obj).filter(x=>Object.keys(x).length>0):[]}
function edgeType(v:string){return v.trim().toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_+|_+$/g,'')}

function chunks(markdown:string){
  const lines=markdown.split('\n'); let heading:string[]=[]; let buf:string[]=[]; let start=1; const out:{heading:string;lineStart:number;lineEnd:number;text:string}[]=[];
  const flush=(end:number)=>{const raw=buf.join('\n').trim();if(!raw){buf=[];return;}let cursor=0;while(cursor<raw.length){let stop=Math.min(raw.length,cursor+MAX_CHARS);if(stop<raw.length){const p=raw.lastIndexOf('\n\n',stop);if(p>cursor+1000)stop=p;}const text=raw.slice(cursor,stop).trim();if(text)out.push({heading:heading.join(' / '),lineStart:start,lineEnd:end,text});if(stop>=raw.length)break;cursor=Math.max(stop-OVERLAP,cursor+1);}buf=[];};
  lines.forEach((line,i)=>{const m=line.match(/^(#{1,6})\s+(.+)$/);if(m){flush(i);const level=m[1].length;heading=heading.slice(0,level-1);heading[level-1]=m[2].trim();start=i+1;buf=[line];}else{if(!buf.length)start=i+1;buf.push(line)}});flush(lines.length);return out;
}

function graphValues(data:JsonObject){
  const groups:[string,string,string[]][]=[
    ['topic','COVERS_TOPIC',arr(data.topics)],['geography','COVERS_GEOGRAPHY',arr(data.geographies)],
    ['period','COVERS_PERIOD',arr(data.period_labels??data.periods).concat(data.period_start||data.period_end?[`${String(data.period_start??'?')}–${String(data.period_end??'?')}`]:[])],['person','MENTIONS_PERSON',arr(data.people)],
    ['entity','MENTIONS_ENTITY',arr(data.entities)],['dog_type','DISCUSSES_DOG_TYPE',arr(data.dog_types??data.breeds)],
    ['language','USES_LANGUAGE',arr(data.source_languages??data.languages)]
  ]; return groups;
}

function explicitNodes(data:JsonObject):ExplicitNode[]{return objects(data.graph_nodes).flatMap(item=>{const type=String(item.type??'').trim();const label=String(item.label??'').trim();return type&&label?[{type,label,properties:obj(item.properties)}]:[]})}
function explicitRelationships(data:JsonObject):ExplicitRelationship[]{return objects(data.graph_relationships).flatMap(item=>{const subject=String(item.subject??'').trim();const subjectType=String(item.subject_type??'entity').trim();const predicate=edgeType(String(item.predicate??''));const object=String(item.object??'').trim();const objectType=String(item.object_type??'entity').trim();const parsed=Number(item.confidence??1);const confidence=Number.isFinite(parsed)?Math.max(0,Math.min(1,parsed)):1;return subject&&predicate&&object?[{subject,subjectType,predicate,object,objectType,confidence,properties:obj(item.properties)}]:[]})}

async function main(){
  if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required');
  const sql=neon(process.env.DATABASE_URL);const gitSha=process.env.VERCEL_GIT_COMMIT_SHA||execSync('git rev-parse HEAD',{encoding:'utf8'}).trim();
  const docs=await listCorpus();const manifestKeys=docs.map(doc=>doc.documentId||doc.path);
  const run=await sql`INSERT INTO galgo.ingestion_runs(git_sha,embedding_model,parser_version,documents,status) VALUES(${gitSha},${EMBEDDING_MODEL},${PARSER_VERSION},${docs.length},'running') RETURNING id`;
  const runId=run[0].id;let changedDocuments=0,skippedDocuments=0,newlyEmbedded=0,retiredDocuments=0;
  try{
    for(const doc of docs){
      const raw=doc.body;const fm=doc.frontmatter;const key=doc.documentId||doc.path;const cHash=hash(JSON.stringify(fm)+raw);
      const existing=await sql`SELECT id,content_hash FROM galgo.documents WHERE document_key=${key} LIMIT 1`;
      const unchanged=existing.length>0&&String(existing[0].content_hash)===cHash;
      const rows=await sql`INSERT INTO galgo.documents(document_key,repository_path,title,slug,corpus_status,content_hash,git_sha,frontmatter,markdown,active,retired_at)
        VALUES(${key},${doc.path},${doc.title},${doc.slug},${doc.status},${cHash},${gitSha},${JSON.stringify(fm)}::jsonb,${raw},true,NULL)
        ON CONFLICT(document_key) DO UPDATE SET repository_path=excluded.repository_path,title=excluded.title,slug=excluded.slug,corpus_status=excluded.corpus_status,content_hash=excluded.content_hash,git_sha=excluded.git_sha,frontmatter=excluded.frontmatter,markdown=excluded.markdown,active=true,retired_at=NULL,updated_at=now(),ingested_at=now() RETURNING id`;
      const documentId=rows[0].id;
      if(unchanged){skippedDocuments++;continue;}
      changedDocuments++;
      await sql`DELETE FROM galgo.graph_edges WHERE document_id=${documentId}`;
      await sql`DELETE FROM galgo.chunks WHERE document_id=${documentId}`;
      const parts=chunks(raw);const batchSize=40;
      for(let i=0;i<parts.length;i+=batchSize){const batch=parts.slice(i,i+batchSize);const {embeddings}=await embedMany({model:EMBEDDING_MODEL,values:batch.map(x=>x.text)});for(let j=0;j<batch.length;j++){const p=batch[j];const idx=i+j;await sql`INSERT INTO galgo.chunks(document_id,chunk_index,heading_path,line_start,line_end,text,content_hash,embedding,embedding_model,token_estimate) VALUES(${documentId},${idx},${p.heading},${p.lineStart},${p.lineEnd},${p.text},${hash(p.text)},${JSON.stringify(embeddings[j])}::vector,${EMBEDDING_MODEL},${Math.ceil(p.text.length/4)})`;newlyEmbedded++;}}
      const dKey=`document:${norm(key)}`;const dn=await sql`INSERT INTO galgo.graph_nodes(node_key,node_type,label,normalized_label,properties) VALUES(${dKey},'document',${doc.title},${norm(doc.title)},${JSON.stringify({repository_path:doc.path,document_key:key})}::jsonb) ON CONFLICT(node_key) DO UPDATE SET label=excluded.label,normalized_label=excluded.normalized_label,properties=galgo.graph_nodes.properties||excluded.properties,updated_at=now() RETURNING id`;const sourceId=dn[0].id;
      for(const [type,edge,values] of graphValues(fm))for(const value of values){const nKey=`${type}:${norm(value)}`;const target=await sql`INSERT INTO galgo.graph_nodes(node_key,node_type,label,normalized_label) VALUES(${nKey},${type},${value},${norm(value)}) ON CONFLICT(node_key) DO UPDATE SET label=excluded.label,updated_at=now() RETURNING id`;await sql`INSERT INTO galgo.graph_edges(source_node_id,edge_type,target_node_id,document_id,provenance,confidence) VALUES(${sourceId},${edge},${target[0].id},${documentId},${JSON.stringify({source:'frontmatter',repository_path:doc.path})}::jsonb,1.0) ON CONFLICT DO NOTHING`}
      for(const node of explicitNodes(fm)){const nKey=`${node.type}:${norm(node.label)}`;const target=await sql`INSERT INTO galgo.graph_nodes(node_key,node_type,label,normalized_label,properties) VALUES(${nKey},${node.type},${node.label},${norm(node.label)},${JSON.stringify(node.properties)}::jsonb) ON CONFLICT(node_key) DO UPDATE SET label=excluded.label,properties=galgo.graph_nodes.properties||excluded.properties,updated_at=now() RETURNING id`;await sql`INSERT INTO galgo.graph_edges(source_node_id,edge_type,target_node_id,document_id,provenance,confidence) VALUES(${sourceId},'MAPS_NODE',${target[0].id},${documentId},${JSON.stringify({source:'frontmatter.graph_nodes',repository_path:doc.path})}::jsonb,1.0) ON CONFLICT DO NOTHING`}
      for(const rel of explicitRelationships(fm)){const sourceKey=`${rel.subjectType}:${norm(rel.subject)}`;const targetKey=`${rel.objectType}:${norm(rel.object)}`;const source=await sql`INSERT INTO galgo.graph_nodes(node_key,node_type,label,normalized_label) VALUES(${sourceKey},${rel.subjectType},${rel.subject},${norm(rel.subject)}) ON CONFLICT(node_key) DO UPDATE SET label=excluded.label,updated_at=now() RETURNING id`;const target=await sql`INSERT INTO galgo.graph_nodes(node_key,node_type,label,normalized_label) VALUES(${targetKey},${rel.objectType},${rel.object},${norm(rel.object)}) ON CONFLICT(node_key) DO UPDATE SET label=excluded.label,updated_at=now() RETURNING id`;await sql`INSERT INTO galgo.graph_edges(source_node_id,edge_type,target_node_id,document_id,provenance,confidence) VALUES(${source[0].id},${rel.predicate},${target[0].id},${documentId},${JSON.stringify({source:'frontmatter.graph_relationships',repository_path:doc.path,...rel.properties})}::jsonb,${rel.confidence}) ON CONFLICT DO NOTHING`}
    }
    const retired=await sql`UPDATE galgo.documents SET active=false,retired_at=COALESCE(retired_at,now()),updated_at=now() WHERE active=true AND NOT (document_key=ANY(${manifestKeys}::text[])) RETURNING id`;
    retiredDocuments=retired.length;
    if(changedDocuments>0){await sql`DROP INDEX IF EXISTS galgo.chunks_bm25`;await sql`CREATE INDEX chunks_bm25 ON galgo.chunks USING lakebase_bm25 (search_text) WITH (default_limit=50)`}
    const counts=await sql`SELECT (SELECT count(*)::int FROM galgo.documents WHERE active=true) documents,(SELECT count(*)::int FROM galgo.chunks c JOIN galgo.documents d ON d.id=c.document_id WHERE d.active=true) chunks,(SELECT count(*)::int FROM galgo.chunks c JOIN galgo.documents d ON d.id=c.document_id WHERE d.active=true AND c.embedding IS NOT NULL) embedded,(SELECT count(*)::int FROM galgo.graph_nodes) nodes,(SELECT count(*)::int FROM galgo.graph_edges e JOIN galgo.documents d ON d.id=e.document_id WHERE d.active=true) edges`;
    const totals=counts[0];
    await sql`UPDATE galgo.ingestion_runs SET documents=${totals.documents},chunks=${totals.chunks},embedded_chunks=${totals.embedded},graph_nodes=${totals.nodes},graph_edges=${totals.edges},status='completed',details=${JSON.stringify({manifestDocuments:docs.length,changedDocuments,skippedDocuments,newlyEmbedded,retiredDocuments})}::jsonb,completed_at=now() WHERE id=${runId}`;
    console.log(JSON.stringify({runId,manifestDocuments:docs.length,documents:totals.documents,chunks:totals.chunks,embedded:totals.embedded,graphNodes:totals.nodes,graphEdges:totals.edges,changedDocuments,skippedDocuments,newlyEmbedded,retiredDocuments},null,2));
  }catch(error){await sql`UPDATE galgo.ingestion_runs SET status='failed',details=${JSON.stringify({error:String(error),manifestDocuments:docs.length,changedDocuments,skippedDocuments,newlyEmbedded,retiredDocuments})}::jsonb,completed_at=now() WHERE id=${runId}`;throw error}
}
main().catch(error=>{console.error(error);process.exitCode=1});
