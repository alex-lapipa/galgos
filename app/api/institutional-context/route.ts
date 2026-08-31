import {NextRequest,NextResponse} from 'next/server';
import {retrieve} from '@/lib/rag';

export const runtime='nodejs';

export async function POST(request:NextRequest){
 try{
  const body=await request.json() as {query?:string};
  const query=body.query?.trim();
  if(!query)return NextResponse.json({error:'query is required'},{status:400});
  const chunks=await retrieve(query,6);
  return NextResponse.json({documents:chunks.map(chunk=>({
   chunkId:chunk.chunk_id,documentId:chunk.document_id,title:chunk.title,repositoryPath:chunk.repository_path,
   heading:chunk.heading_path,lineStart:chunk.line_start,lineEnd:chunk.line_end,excerpt:chunk.chunk_text,score:chunk.score,
  }))});
 }catch(error){
  console.error('[institutional-context]',error);
  return NextResponse.json({error:'Unable to load institutional evidence'},{status:500});
 }
}
