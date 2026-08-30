import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { retrieve } from '@/lib/rag';

const request=z.object({question:z.string().min(8).max(1200)});
const GENERATION_MODEL=process.env.RAG_GENERATION_MODEL||'openai/gpt-5.6-sol';

export async function POST(req:Request){
  const parsed=request.safeParse(await req.json());
  if(!parsed.success)return NextResponse.json({error:'A research question is required.'},{status:400});
  try{
    const chunks=await retrieve(parsed.data.question,12);
    if(!chunks.length)return NextResponse.json({answer:'The archive does not contain enough evidence to answer that question.',citations:[],retrieved:0});
    const evidence=chunks.map((c,i)=>`[${i+1}] ${c.repository_path}:${c.line_start}-${c.line_end}\n${c.heading_path}\n${c.chunk_text}`).join('\n\n');
    const {text}=await generateText({
      model:GENERATION_MODEL,
      prompt:`You are the Galgo Espanol Archive research assistant. Answer ONLY from the supplied archive evidence. Distinguish confirmed evidence from inference, tradition, disputed claims, and unsupported ancestry claims. Never convert similarity into historical continuity. Cite factual statements using [n] markers that correspond exactly to the supplied evidence. If evidence is insufficient, say so.\n\nQUESTION:\n${parsed.data.question}\n\nARCHIVE EVIDENCE:\n${evidence}`
    });
    return NextResponse.json({answer:text,citations:chunks.map((c,i)=>({id:i+1,title:c.title,path:c.repository_path,heading:c.heading_path,lines:[c.line_start,c.line_end],score:c.score})),retrieved:chunks.length,models:{embedding:'openai/text-embedding-3-small',generation:GENERATION_MODEL}});
  }catch(error){console.error('ask archive failed',error);return NextResponse.json({error:'Archive retrieval is temporarily unavailable.'},{status:503});}
}
