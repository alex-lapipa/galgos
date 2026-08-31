import {NextResponse} from 'next/server';
import {neon} from '@neondatabase/serverless';
import {listCorpus} from '@/lib/corpus';
import {EMBEDDING_MODEL} from '@/lib/rag';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function GET(){
  const deployedGitSha=process.env.VERCEL_GIT_COMMIT_SHA||null;
  const generationModel=process.env.RAG_GENERATION_MODEL||'openai/gpt-5.6-sol';
  try{
    if(!process.env.DATABASE_URL)throw new Error('database unavailable');
    const [manifest,sql]=await Promise.all([listCorpus(),Promise.resolve(neon(process.env.DATABASE_URL))]);
    const expectedKeys=manifest.map(doc=>doc.documentId||doc.path).sort();
    const policyWarnings=manifest.flatMap(doc=>doc.policyWarnings);
    const sourceRoles=Object.fromEntries([...new Set(manifest.map(doc=>doc.sourceRole))].sort().map(role=>[role,manifest.filter(doc=>doc.sourceRole===role).length]));
    const rows=await sql`SELECT document_key FROM galgo.documents WHERE active=true ORDER BY document_key`;
    const activeKeys=rows.map(row=>String(row.document_key));
    const missing=expectedKeys.filter(key=>!activeKeys.includes(key));
    const unexpected=activeKeys.filter(key=>!expectedKeys.includes(key));
    const stats=await sql`SELECT
      (SELECT count(*)::int FROM galgo.documents WHERE active=true) active_documents,
      (SELECT count(*)::int FROM galgo.documents WHERE active=false) retired_documents,
      (SELECT count(*)::int FROM galgo.chunks c JOIN galgo.documents d ON d.id=c.document_id WHERE d.active=true) active_chunks,
      (SELECT count(*)::int FROM galgo.chunks c JOIN galgo.documents d ON d.id=c.document_id WHERE d.active=true AND c.embedding IS NOT NULL) embedded_chunks,
      (SELECT count(*)::int FROM galgo.graph_nodes) graph_nodes,
      (SELECT count(*)::int FROM galgo.graph_edges e JOIN galgo.documents d ON d.id=e.document_id WHERE d.active=true) active_graph_edges`;
    const runs=await sql`SELECT git_sha,parser_version,embedding_model,status,completed_at FROM galgo.ingestion_runs WHERE status='completed' ORDER BY completed_at DESC NULLS LAST LIMIT 1`;
    const s=stats[0]||{};const latest=runs[0]||null;
    const embeddingsComplete=Number(s.active_chunks||0)===Number(s.embedded_chunks||0);
    const manifestSynced=missing.length===0&&unexpected.length===0&&Number(s.active_documents||0)===expectedKeys.length;
    const deploymentSynced=!deployedGitSha||!latest?.git_sha||String(latest.git_sha)===deployedGitSha;
    const healthy=manifestSynced&&embeddingsComplete&&deploymentSynced;
    return NextResponse.json({
      status:healthy?'healthy':'degraded',
      architecture:'GitHub corpus → Vercel release → Vercel-connected Neon',
      deployedGitSha,
      manifest:{expectedDocuments:expectedKeys.length,activeDocuments:Number(s.active_documents||0),missing,unexpected},
      corpusPolicy:{explicitMetadataMigrationComplete:policyWarnings.length===0,warningCount:policyWarnings.length,warningSample:policyWarnings.slice(0,12),sourceRoles},
      retrieval:{activeChunks:Number(s.active_chunks||0),embeddedChunks:Number(s.embedded_chunks||0),embeddingsComplete,embeddingModel:EMBEDDING_MODEL,generationModel,maxChunksPerDocument:2},
      graph:{nodes:Number(s.graph_nodes||0),activeEdges:Number(s.active_graph_edges||0)},
      lifecycle:{retiredDocuments:Number(s.retired_documents||0)},
      ingestion:latest?{gitSha:String(latest.git_sha),parserVersion:String(latest.parser_version),embeddingModel:String(latest.embedding_model),completedAt:latest.completed_at}:null,
      checks:{manifestSynced,embeddingsComplete,deploymentSynced}
    },{status:healthy?200:503,headers:{'Cache-Control':'no-store'}});
  }catch(error){
    console.error('[research-health]',error);
    return NextResponse.json({status:'unavailable',architecture:'GitHub corpus → Vercel release → Vercel-connected Neon',deployedGitSha,error:'Research health data is temporarily unavailable.'},{status:503,headers:{'Cache-Control':'no-store'}});
  }
}
