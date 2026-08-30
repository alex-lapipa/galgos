import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { neon } from '@neondatabase/serverless';
import { embedMany } from 'ai';
import { listCorpus } from '../lib/corpus';
import { EMBEDDING_MODEL } from '../lib/rag';

const PARSER_VERSION='rag-v1';
const MAX_CHARS=3200;
const OVERLAP=350;

function hash(v:string){return crypto.createHash('sha256').update(v).digest('hex')}
function norm(v:string){return v.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ')}
function arr(v:unknown):string[]{return Array.isArray(v)?v.map(String).map(x=>x.trim()).filter(Boolean):typeof v==='string'?v.split(/[,;|]/).map(x=>x.trim()).filter(Boolean):[]}

function chunks(markdown:string){
  const lines=markdown.split('\n'); let heading:string[]=[]; let buf:string[]=[]; let start=1; const out:any[]=[];
  const flush=(end:number)=>{const raw=buf.join('\n').trim();if(!raw){buf=[];return;}let cursor=0;while(cursor<raw.length){let stop=Math.min(raw.length,cursor+MAX_CHARS);if(stop<raw.length){const p=raw.lastIndexOf('\n\n',stop);if(p>cursor+1000)stop=p;}const text=raw.slice(cursor,stop).trim();if(text)out.push({heading:heading.join(' / '),lineStart:start,lineEnd:end,text});if(stop>=raw.length)break;cursor=Math.max(stop-OVERLAP,cursor+1);}buf=[];};
  lines.forEach((line,i)=>{const m=line.match(/^(#{1,6})\s+(.+)$/);if(m){flush(i);const level=m[1].length;heading=heading.slice(0,level-1);heading[level-1]=m[2].trim();start=i+1;buf=[line];}else{if(!buf.length)start=i+1;buf.push(line)}});flush(lines.length);return out;
}

function graphValues(data:Record<string,unknown>){
  const groups:[string,string,string[]][]=[
    ['topic','COVERS_TOPIC',arr(data.topics)],['geography','COVERS_GEOGRAPHY',arr(data.geographies)],
    ['period','COVERS_PERIOD',arr(data.period_labels??data.periods).concat(data.period_start||data.period_end?[`${String(data.period_start??'?')}–${String(data.period_end??'?')}`]:[])],['person','MENTIONS_PERSON',arr(data.people)],
    ['entity','MENTIONS_ENTITY',arr(data.entities)],['dog_type','DISCUSSES_DOG_TYPE',arr(data.dog_types??data.breeds)],
    ['language','USES_LANGUAGE',arr(data.source_languages??data.languages)]
  ]; return groups;
}

async function main(){
  if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required');
  const sql=neon(process.env.DATABASE_URL); const gitSha=execSync('git rev-parse HEAD',{encoding:'utf8'}).trim();
  const docs=await listCorpus();
  const run=await sql`INSERT INTO galgo.ingestion_runs(git_sha,embedding_model,parser_version,documents,status) VALUES(${gitSha},${EMBEDDING_MODEL},${PARSER_VERSION},${docs.length},'running') RETURNING id`;
  const runId=run[0].id; let totalChunks=0, embedded=0;
  try{
    for(const doc of docs){
      const raw=doc.body; const fm=doc.frontmatter; const key=doc.documentId||doc.path; const cHash=hash(JSON.stringify(fm)+raw);
      const rows=await sql`INSERT INTO galgo.documents(document_key,repository_path,title,slug,corpus_status,content_hash,git_sha,frontmatter,markdown)
        VALUES(${key},${doc.path},${doc.title},${doc.slug},${doc.status},${cHash},${gitSha},${JSON.stringify(fm)}::jsonb,${raw})
        ON CONFLICT(document_key) DO UPDATE SET repository_path=excluded.repository_path,title=excluded.title,slug=excluded.slug,corpus_status=excluded.corpus_status,content_hash=excluded.content_hash,git_sha=excluded.git_sha,frontmatter=excluded.frontmatter,markdown=excluded.markdown,updated_at=now(),ingested_at=now() RETURNING id`;
      const documentId=rows[0].id; await sql`DELETE FROM galgo.chunks WHERE document_id=${documentId}`;
      const parts=chunks(raw); totalChunks+=parts.length;
      const batchSize=40;
      for(let i=0;i<parts.length;i+=batchSize){
        const batch=parts.slice(i,i+batchSize); const {embeddings}=await embedMany({model:EMBEDDING_MODEL,values:batch.map(x=>x.text)});
        for(let j=0;j<batch.length;j++){const p=batch[j];const idx=i+j;await sql`INSERT INTO galgo.chunks(document_id,chunk_index,heading_path,line_start,line_end,text,content_hash,embedding,embedding_model,token_estimate)
          VALUES(${documentId},${idx},${p.heading},${p.lineStart},${p.lineEnd},${p.text},${hash(p.text)},${JSON.stringify(embeddings[j])}::vector,${EMBEDDING_MODEL},${Math.ceil(p.text.length/4)})`;embedded++;}
      }
      const dKey=`document:${norm(key)}`; const dn=await sql`INSERT INTO galgo.graph_nodes(node_key,node_type,label,normalized_label,properties) VALUES(${dKey},'document',${doc.title},${norm(doc.title)},${JSON.stringify({repository_path:doc.path,document_key:key})}::jsonb) ON CONFLICT(node_key) DO UPDATE SET label=excluded.label,normalized_label=excluded.normalized_label,properties=excluded.properties,updated_at=now() RETURNING id`; const sourceId=dn[0].id;
      for(const [type,edge,values] of graphValues(fm))for(const value of values){const nKey=`${type}:${norm(value)}`;const target=await sql`INSERT INTO galgo.graph_nodes(node_key,node_type,label,normalized_label) VALUES(${nKey},${type},${value},${norm(value)}) ON CONFLICT(node_key) DO UPDATE SET label=excluded.label,updated_at=now() RETURNING id`;await sql`INSERT INTO galgo.graph_edges(source_node_id,edge_type,target_node_id,document_id,provenance,confidence) VALUES(${sourceId},${edge},${target[0].id},${documentId},${JSON.stringify({source:'frontmatter',repository_path:doc.path})}::jsonb,1.0) ON CONFLICT DO NOTHING`;}
    }
    const counts=await sql`SELECT (SELECT count(*)::int FROM galgo.graph_nodes) nodes,(SELECT count(*)::int FROM galgo.graph_edges) edges`;
    await sql`UPDATE galgo.ingestion_runs SET chunks=${totalChunks},embedded_chunks=${embedded},graph_nodes=${counts[0].nodes},graph_edges=${counts[0].edges},status='completed',completed_at=now() WHERE id=${runId}`;
    console.log(JSON.stringify({runId,documents:docs.length,chunks:totalChunks,embedded,graphNodes:counts[0].nodes,graphEdges:counts[0].edges},null,2));
  }catch(error){await sql`UPDATE galgo.ingestion_runs SET status='failed',details=${JSON.stringify({error:String(error)})}::jsonb,completed_at=now() WHERE id=${runId}`;throw error}
}
main();
