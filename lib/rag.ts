import { neon } from '@neondatabase/serverless';
import { embed } from 'ai';

export const EMBEDDING_MODEL = 'openai/text-embedding-3-small';

function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  return neon(process.env.DATABASE_URL);
}

export type RetrievedChunk = {
  chunk_id:string; document_id:string; title:string; repository_path:string; heading_path:string;
  line_start:number; line_end:number; chunk_text:string; semantic_score:number; lexical_score:number; score:number;
};

function diversify(rows:RetrievedChunk[],limit:number,maxPerDocument=2){
 const selected:RetrievedChunk[]=[];const counts=new Map<string,number>();
 for(const row of rows){const count=counts.get(row.document_id)||0;if(count>=maxPerDocument)continue;selected.push(row);counts.set(row.document_id,count+1);if(selected.length>=limit)break;}
 return selected;
}

export async function retrieve(question:string, limit=12):Promise<RetrievedChunk[]> {
  const { embedding } = await embed({ model: EMBEDDING_MODEL, value: question });
  const sql = db();
  const candidateCount=Math.min(90,Math.max(limit*3,30));
  const rows = await sql`SELECT * FROM galgo.hybrid_search(${question}, ${JSON.stringify(embedding)}::vector, ${candidateCount}, 0.70, 0.30)` as RetrievedChunk[];
  return diversify(rows,limit);
}

export async function graphContext(labels:string[], limit=30) {
  const clean = labels.map(x=>x.trim().toLowerCase()).filter(Boolean).slice(0,12);
  if (!clean.length) return [];
  const sql=db();
  return sql`SELECT sn.label AS source, e.edge_type, tn.label AS target, d.repository_path, e.provenance, e.confidence
    FROM galgo.graph_edges e
    JOIN galgo.graph_nodes sn ON sn.id=e.source_node_id
    JOIN galgo.graph_nodes tn ON tn.id=e.target_node_id
    JOIN galgo.documents d ON d.id=e.document_id
    WHERE d.active=true AND (sn.normalized_label = ANY(${clean}) OR tn.normalized_label = ANY(${clean}))
    ORDER BY e.confidence DESC LIMIT ${limit}`;
}
