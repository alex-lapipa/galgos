import { NextResponse } from 'next/server';
import { z } from 'zod';
import { retrieve } from '@/lib/rag';

const schema=z.object({query:z.string().min(3).max(1200),limit:z.number().int().min(1).max(30).optional()});
export async function POST(req:Request){
  const input=schema.safeParse(await req.json());
  if(!input.success)return NextResponse.json({error:'Invalid query.'},{status:400});
  try{return NextResponse.json({query:input.data.query,results:await retrieve(input.data.query,input.data.limit??12)});}
  catch(error){console.error('rag search failed',error);return NextResponse.json({error:'Retrieval unavailable.'},{status:503});}
}
