import Link from 'next/link';
import {getCorpusDocument,listCorpus,type CorpusDoc} from '@/lib/corpus';
import {notFound} from 'next/navigation';
import styles from './ArchiveDocument.module.css';

function str(v:unknown){return v==null?'':String(v)}
function arr(v:unknown){return Array.isArray(v)?v.map(String).filter(Boolean):v?[String(v)]:[]}
function pretty(v:string){return v.replaceAll('_',' ').replaceAll('-',' ')}
function overlap(a:string[],b:string[]){const sb=new Set(b.map(x=>x.toLowerCase()));return a.reduce((n,x)=>n+(sb.has(x.toLowerCase())?1:0),0)}
function relatedScore(a:CorpusDoc,b:CorpusDoc){
 let score=0;const af=a.frontmatter,bf=b.frontmatter;
 score+=overlap(arr(af.topics),arr(bf.topics))*5;
 score+=overlap(arr(af.entities),arr(bf.entities))*4;
 score+=overlap(arr(af.people),arr(bf.people))*3;
 score+=overlap(arr(af.geographies),arr(bf.geographies))*2;
 score+=overlap(arr(af.dog_types),arr(bf.dog_types))*2;
 if(str(af.batch)&&str(af.batch)===str(bf.batch))score+=2;
 if(str(af.document_type)&&str(af.document_type)===str(bf.document_type))score+=1;
 return score;
}

const lineage:Record<string,{relation:string,path:string}[]>={
 'Institutional_Map_Galgo_Espanol_2026.md':[{relation:'canonicalized from source record',path:'compass_artifact_wf-2bff7e45-e211-5090-bb0c-5247bc9b6224_text_markdown.md'}],
 'compass_artifact_wf-2bff7e45-e211-5090-bb0c-5247bc9b6224_text_markdown.md':[{relation:'source record for canonical synthesis',path:'Institutional_Map_Galgo_Espanol_2026.md'}]
};

export async function generateStaticParams(){return (await listCorpus()).map(d=>({document:d.slug}))}

export default async function Doc({params}:{params:Promise<{document:string}>}){
 const slug=(await params).document;const d=await getCorpusDocument(slug);if(!d)notFound();
 const docs=await listCorpus();
 const related=docs.filter(x=>x.path!==d.path).map(x=>({doc:x,score:relatedScore(d,x)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.doc.title.localeCompare(b.doc.title)).slice(0,4);
 const explicitLineage=(lineage[d.path]||[]).map(l=>({relation:l.relation,doc:docs.find(x=>x.path===l.path)})).filter((x):x is {relation:string;doc:CorpusDoc}=>!!x.doc);
 const fm=d.frontmatter;const topics=arr(fm.topics),geographies=arr(fm.geographies),entities=arr(fm.entities),people=arr(fm.people),dogTypes=arr(fm.dog_types);
 const meta=[
  ['Document type',str(fm.document_type)],['Evidence level',str(fm.evidence_level)],['Review status',str(fm.review_status)],['Source quality',str(fm.source_quality)],['Period',[str(fm.period_start),str(fm.period_end)].filter(Boolean).join('–')],['Language',str(fm.language)],['Batch',str(fm.batch)],['Created',str(fm.created_at)],['Updated',str(fm.updated_at)]
 ].filter(([,v])=>v);
 return <main className={styles.page}>
  <Link className={styles.back} href="/archive">← Research library</Link>
  <section className={styles.hero}>
   <div className={styles.identity}><span className={styles[d.status]}>{d.status}</span>{str(fm.evidence_level)&&<span>{pretty(str(fm.evidence_level))}</span>}{str(fm.review_status)&&<span>{pretty(str(fm.review_status))}</span>}</div>
   <h1>{d.title}</h1><p className={styles.path}>{d.documentId||'UNREGISTERED'} · {d.path}</p>
  </section>
  <div className={styles.layout}>
   <section>
    {!!meta.length&&<div className={styles.metaGrid}>{meta.map(([k,v])=><div key={k}><b>{k}</b><span>{pretty(v)}</span></div>)}</div>}
    <pre className={styles.body}>{d.body}</pre>
   </section>
   <aside className={styles.aside}>
    <div className={styles.panel}><span className="eyebrow">Research actions</span><div className={styles.actions}><Link href={`/ask?q=${encodeURIComponent(d.title)}`}>Ask this record <span>→</span></Link><Link href="/en/timeline">Timeline <span>→</span></Link><Link href="/en/graph">Institutional graph <span>→</span></Link></div></div>
    {(topics.length||geographies.length||entities.length||people.length||dogTypes.length)?<div className={styles.panel}><span className="eyebrow">Explicit metadata</span>{topics.length>0&&<><h2>Topics</h2><div className={styles.tags}>{topics.map(x=><span key={x}>{x}</span>)}</div></>}{geographies.length>0&&<><h2>Geographies</h2><div className={styles.tags}>{geographies.map(x=><span key={x}>{x}</span>)}</div></>}{entities.length>0&&<><h2>Entities</h2><div className={styles.tags}>{entities.slice(0,14).map(x=><span key={x}>{x}</span>)}</div></>}{people.length>0&&<><h2>People</h2><div className={styles.tags}>{people.slice(0,14).map(x=><span key={x}>{x}</span>)}</div></>}{dogTypes.length>0&&<><h2>Dog types</h2><div className={styles.tags}>{dogTypes.map(x=><span key={x}>{x}</span>)}</div></>}</div>:null}
    <div className={styles.panel}><span className="eyebrow">Evidence semantics</span><h2>{d.status==='legacy'?'Retained source record':d.status==='methodology'?'Methodology record':'Canonical corpus record'}</h2><p>{d.status==='legacy'?'This record remains part of the searchable evidence base but is not presented as equivalent to a canonical synthesis.':d.status==='methodology'?'This record governs research method, source hierarchy or claim classification rather than serving as a historical claim by itself.':'This is a curated corpus record. Canonical status affects retrieval/provenance handling; it does not make every statement automatically true.'}</p></div>
    {explicitLineage.map(x=><div className={`${styles.panel} ${styles.lineage}`} key={x.doc.path}><strong>Explicit lineage · {x.relation}</strong><Link href={`/archive/${x.doc.slug}`}>{x.doc.title}</Link><p>{x.doc.path}</p></div>)}
   </aside>
  </div>
  {!!related.length&&<section className={styles.related}><div><div><span className="eyebrow">Shared research context</span><h2>Related records.</h2></div><p className={styles.note}>Suggested only from overlap in explicit corpus metadata. This is a discovery aid, not a knowledge-graph edge, lineage claim or evidence of historical influence.</p></div><div className={styles.relatedGrid}>{related.map(({doc,score})=><Link className={styles.relatedCard} href={`/archive/${doc.slug}`} key={doc.path}><small>{doc.status} · metadata overlap {score}</small><h3>{doc.title}</h3><p>{doc.documentId||doc.path}</p></Link>)}</div></section>}
 </main>
}
