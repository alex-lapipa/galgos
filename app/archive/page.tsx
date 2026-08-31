import {listCorpus} from '@/lib/corpus';
import {ArchiveLibrary,type ArchiveRecord} from '@/components/ArchiveLibrary';

function str(v:unknown){return v==null?undefined:String(v)}
function arr(v:unknown){return Array.isArray(v)?v.map(String).filter(Boolean):v? [String(v)]:[]}

export default async function Archive(){
 const docs=await listCorpus();
 const records:ArchiveRecord[]=docs.map(d=>({
  path:d.path,slug:d.slug,title:d.title,documentId:d.documentId,status:d.status,
  documentType:str(d.frontmatter.document_type),evidenceLevel:str(d.frontmatter.evidence_level),reviewStatus:str(d.frontmatter.review_status),sourceQuality:str(d.frontmatter.source_quality),
  periodStart:str(d.frontmatter.period_start),periodEnd:str(d.frontmatter.period_end),language:str(d.frontmatter.language),batch:str(d.frontmatter.batch),
  topics:arr(d.frontmatter.topics),geographies:arr(d.frontmatter.geographies),entities:arr(d.frontmatter.entities),people:arr(d.frontmatter.people),dogTypes:arr(d.frontmatter.dog_types)
 }));
 return <ArchiveLibrary records={records}/>;
}
