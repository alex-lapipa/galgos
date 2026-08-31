import {NextResponse} from 'next/server';
import {neon} from '@neondatabase/serverless';

const SOURCE='Institutional_Map_Galgo_Espanol_2026.md';

function db(){if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is not configured');return neon(process.env.DATABASE_URL)}

export async function GET(){
 try{
  const sql=db();
  const docs=await sql`SELECT id,repository_path,frontmatter,updated_at FROM galgo.documents WHERE repository_path=${SOURCE} AND active=true LIMIT 1`;
  if(!docs.length)return NextResponse.json({error:'Canonical institutional graph source is not ingested.'},{status:404});
  const document=docs[0] as {id:string;repository_path:string;frontmatter:Record<string,unknown>;updated_at:string};
  const rows=await sql`SELECT sn.label AS source,sn.node_type AS source_type,sn.properties AS source_properties,
    e.edge_type AS predicate,tn.label AS target,tn.node_type AS target_type,tn.properties AS target_properties,
    e.confidence,d.repository_path
    FROM galgo.graph_edges e
    JOIN galgo.graph_nodes sn ON sn.id=e.source_node_id
    JOIN galgo.graph_nodes tn ON tn.id=e.target_node_id
    JOIN galgo.documents d ON d.id=e.document_id
    WHERE d.active=true AND d.repository_path=${SOURCE} AND e.edge_type <> 'MAPS_NODE'
    ORDER BY e.edge_type,sn.label,tn.label`;
  const fm=document.frontmatter||{};
  const graphNodes=Array.isArray(fm.graph_nodes)?fm.graph_nodes:[];
  return NextResponse.json({
   source:document.repository_path,
   updatedAt:document.updated_at,
   nodes:graphNodes,
   relationships:rows.map((r:any)=>({source:r.source,predicate:r.predicate,target:r.target,confidence:Number(r.confidence),repositoryPath:r.repository_path})),
   semantics:{layout:'presentation-only',confidence:'curation metadata, not statistical probability',relationships:'explicit stored graph edges only'}
  });
 }catch(error){console.error('institutional graph load failed',error);return NextResponse.json({error:'Institutional graph is temporarily unavailable.'},{status:503})}
}
