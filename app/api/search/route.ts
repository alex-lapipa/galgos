import {NextResponse} from 'next/server';
import {z} from 'zod';
import {retrieve} from '@/lib/rag';
import {listCorpus} from '@/lib/corpus';

const schema=z.object({query:z.string().min(3).max(1200),limit:z.number().int().min(1).max(30).optional()});
function meta(value:unknown){if(value===undefined||value===null||value==='')return null;return Array.isArray(value)?value.map(String).join(', '):String(value)}

export async function POST(req:Request){
 const input=schema.safeParse(await req.json());if(!input.success)return NextResponse.json({error:'Invalid query.'},{status:400});
 try{
  const [results,corpus]=await Promise.all([retrieve(input.data.query,input.data.limit??12),listCorpus()]);
  const byPath=new Map(corpus.map(doc=>[doc.path,doc]));
  return NextResponse.json({query:input.data.query,results:results.map(result=>{const doc=byPath.get(result.repository_path);const fm=doc?.frontmatter??{};return {...result,corpusStatus:doc?.status??'unverified',sourceRole:doc?.sourceRole??'unverified',evidenceLevel:meta(fm.evidence_level)??'unverified',reviewStatus:meta(fm.review_status)}})});
 }catch(error){console.error('rag search failed',error);return NextResponse.json({error:'Retrieval unavailable.'},{status:503})}
}
