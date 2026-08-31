import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import AdmZip from 'adm-zip';
import {resolveCorpusPolicy,type CorpusStatus,type SourceRole} from './corpus-schema';

const root=process.cwd();
const excluded=new Set(['README.md','AGENTS.md','GITHUB_PUSH_INSTRUCTIONS.md','README_DOWNLOAD_GUIDE.md','UPLOAD_MANIFEST_2026-08-30.md']);

export type CorpusDoc={
 path:string;slug:string;title:string;documentId?:string;status:CorpusStatus;sourceRole:SourceRole;
 body:string;frontmatter:Record<string,unknown>;policyWarnings:string[];
};

function parse(file:string,raw:string):CorpusDoc{
 const parsed=matter(raw);const data=parsed.data as Record<string,unknown>;const policy=resolveCorpusPolicy(file,data);
 return {path:file,slug:String(data.slug||file.replace(/\.md$/,'')),title:String(data.title||parsed.content.match(/^#\s+(.+)$/m)?.[1]||file),documentId:data.document_id?String(data.document_id):undefined,status:policy.status,sourceRole:policy.sourceRole,body:parsed.content,frontmatter:{...data,source_role:data.source_role??policy.sourceRole,corpus_status:data.corpus_status??policy.status},policyWarnings:policy.warnings};
}

export async function listCorpus():Promise<CorpusDoc[]>{
 const files=(await fs.readdir(root)).filter(f=>f.endsWith('.md')&&!excluded.has(f));
 const docs=await Promise.all(files.map(async file=>parse(file,await fs.readFile(path.join(root,file),'utf8'))));
 try{
  const zip=new AdmZip(path.join(root,'galgos research.zip'));
  for(const entry of zip.getEntries().filter(e=>e.entryName.endsWith('.md'))){
   const doc=parse(`zip:${entry.entryName}`,entry.getData().toString('utf8'));
   if(!docs.some(existing=>existing.documentId&&existing.documentId===doc.documentId))docs.push(doc);
  }
 }catch{}
 return docs.sort((a,b)=>a.path.localeCompare(b.path));
}

export async function getCorpusDocument(slug:string){return (await listCorpus()).find(d=>d.slug===slug)}
export async function corpusPolicyWarnings(){return (await listCorpus()).flatMap(doc=>doc.policyWarnings)}
