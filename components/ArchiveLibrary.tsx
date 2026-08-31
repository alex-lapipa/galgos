'use client';

import Link from 'next/link';
import {useMemo,useState} from 'react';
import styles from './ArchiveLibrary.module.css';

export type ArchiveRecord={
 path:string;slug:string;title:string;documentId?:string;status:string;documentType?:string;evidenceLevel?:string;reviewStatus?:string;sourceQuality?:string;periodStart?:string;periodEnd?:string;language?:string;batch?:string;topics:string[];geographies:string[];entities:string[];people:string[];dogTypes:string[]
};

type Locale='en'|'es';
type Status='all'|'canonical'|'methodology'|'legacy';

const copy={
 en:{kicker:'Research library · corpus records',title:'The archive is the evidence layer.',dek:'Browse canonical syntheses, methodology and retained source records without flattening their evidential roles. Filters come only from explicit corpus metadata.',search:'Search title, ID, path or metadata',all:'All records',canonical:'Canonical',methodology:'Methodology',legacy:'Source records',type:'Document type',evidence:'Evidence',review:'Review',topic:'Topic',geo:'Geography',reset:'Reset',records:'records',open:'Open record',ask:'Ask about this',period:'Period',notClassified:'not classified',empty:'No records match these filters.',method:'How to read the library',methodText:'Corpus status is a provenance and retrieval classification, not a truth score. Relatedness and filters are discovery aids only; they do not create historical continuity or causal relationships.',canonicalDesc:'Curated corpus records used at full retrieval weight.',methodologyDesc:'Research governance, source hierarchy and claim-classification material.',legacyDesc:'Raw or retained research/source records. These remain searchable but are not presented as equivalent to canonical synthesis.'},
 es:{kicker:'Biblioteca de investigación · corpus',title:'El archivo es la capa de evidencia.',dek:'Explora síntesis canónicas, metodología y registros fuente conservados sin confundir sus funciones evidenciales. Los filtros proceden únicamente de metadatos explícitos del corpus.',search:'Buscar por título, ID, ruta o metadatos',all:'Todos',canonical:'Canónicos',methodology:'Metodología',legacy:'Registros fuente',type:'Tipo de documento',evidence:'Evidencia',review:'Revisión',topic:'Tema',geo:'Geografía',reset:'Restablecer',records:'registros',open:'Abrir registro',ask:'Preguntar sobre esto',period:'Periodo',notClassified:'sin clasificar',empty:'Ningún registro coincide con estos filtros.',method:'Cómo leer la biblioteca',methodText:'El estado del corpus es una clasificación de procedencia y recuperación, no una puntuación de verdad. La relación temática y los filtros son ayudas de descubrimiento; no crean continuidad histórica ni relaciones causales.',canonicalDesc:'Registros curados del corpus utilizados con peso completo en recuperación.',methodologyDesc:'Gobernanza de investigación, jerarquía de fuentes y clasificación de afirmaciones.',legacyDesc:'Investigación o fuentes brutas conservadas. Siguen siendo buscables, pero no se presentan como equivalentes a una síntesis canónica.'}
} as const;

function uniq(values:string[]){return [...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b));}
function haystack(r:ArchiveRecord){return [r.title,r.documentId,r.path,r.documentType,r.evidenceLevel,r.reviewStatus,r.sourceQuality,r.periodStart,r.periodEnd,r.language,r.batch,...r.topics,...r.geographies,...r.entities,...r.people,...r.dogTypes].filter(Boolean).join(' ').toLowerCase();}
function pretty(v?:string){return (v||'').replaceAll('_',' ').replaceAll('-',' ');}

export function ArchiveLibrary({records}:{records:ArchiveRecord[]}){
 const [locale,setLocale]=useState<Locale>('en');
 const [status,setStatus]=useState<Status>('all');
 const [query,setQuery]=useState('');
 const [type,setType]=useState('all');
 const [evidence,setEvidence]=useState('all');
 const [review,setReview]=useState('all');
 const [topic,setTopic]=useState('all');
 const [geo,setGeo]=useState('all');
 const t=copy[locale];
 const types=useMemo(()=>uniq(records.map(r=>r.documentType||'')),[records]);
 const evidenceLevels=useMemo(()=>uniq(records.map(r=>r.evidenceLevel||'')),[records]);
 const reviews=useMemo(()=>uniq(records.map(r=>r.reviewStatus||'')),[records]);
 const topics=useMemo(()=>uniq(records.flatMap(r=>r.topics)).slice(0,80),[records]);
 const geos=useMemo(()=>uniq(records.flatMap(r=>r.geographies)).slice(0,60),[records]);
 const filtered=useMemo(()=>records.filter(r=>{
   if(status!=='all'&&r.status!==status)return false;
   if(query&&!haystack(r).includes(query.toLowerCase()))return false;
   if(type!=='all'&&r.documentType!==type)return false;
   if(evidence!=='all'&&r.evidenceLevel!==evidence)return false;
   if(review!=='all'&&r.reviewStatus!==review)return false;
   if(topic!=='all'&&!r.topics.includes(topic))return false;
   if(geo!=='all'&&!r.geographies.includes(geo))return false;
   return true;
 }),[records,status,query,type,evidence,review,topic,geo]);
 const counts={canonical:records.filter(r=>r.status==='canonical').length,methodology:records.filter(r=>r.status==='methodology').length,legacy:records.filter(r=>r.status==='legacy').length};
 const reset=()=>{setStatus('all');setQuery('');setType('all');setEvidence('all');setReview('all');setTopic('all');setGeo('all')};
 return <main className={styles.page}>
  <section className={styles.hero}>
   <div><span className="eyebrow">{t.kicker}</span><h1>{t.title}</h1><p>{t.dek}</p></div>
   <div className={styles.locale}><button className={locale==='en'?styles.active:''} onClick={()=>setLocale('en')}>EN</button><button className={locale==='es'?styles.active:''} onClick={()=>setLocale('es')}>ES</button></div>
  </section>
  <section className={styles.statusGrid}>
   <button onClick={()=>setStatus('all')} className={status==='all'?styles.selected:''}><b>{records.length}</b><span>{t.all}</span></button>
   <button onClick={()=>setStatus('canonical')} className={status==='canonical'?styles.selected:''}><b>{counts.canonical}</b><span>{t.canonical}</span><small>{t.canonicalDesc}</small></button>
   <button onClick={()=>setStatus('methodology')} className={status==='methodology'?styles.selected:''}><b>{counts.methodology}</b><span>{t.methodology}</span><small>{t.methodologyDesc}</small></button>
   <button onClick={()=>setStatus('legacy')} className={status==='legacy'?styles.selected:''}><b>{counts.legacy}</b><span>{t.legacy}</span><small>{t.legacyDesc}</small></button>
  </section>
  <section className={`${styles.controls} glass-panel`}>
   <label className={styles.search}><span>{t.search}</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={locale==='es'?'p. ej. Fueros, Yo Galgo, Ley 7/2023…':'e.g. Fueros, Yo Galgo, Ley 7/2023…'}/></label>
   <div className={styles.facets}>
    <Facet label={t.type} value={type} set={setType} values={types}/><Facet label={t.evidence} value={evidence} set={setEvidence} values={evidenceLevels}/><Facet label={t.review} value={review} set={setReview} values={reviews}/><Facet label={t.topic} value={topic} set={setTopic} values={topics}/><Facet label={t.geo} value={geo} set={setGeo} values={geos}/>
   </div>
   <div className={styles.controlFoot}><span>{filtered.length} / {records.length} {t.records}</span><button onClick={reset}>{t.reset}</button></div>
  </section>
  <section className={styles.library}>
   {filtered.map((r,i)=><article className={styles.card} key={r.path}>
    <div className={styles.index}>{String(i+1).padStart(2,'0')}</div>
    <div className={styles.cardBody}>
     <div className={styles.chips}><span className={`${styles.status} ${styles[r.status]}`}>{r.status==='legacy'?t.legacy:r.status==='methodology'?t.methodology:t.canonical}</span>{r.evidenceLevel&&<span>{pretty(r.evidenceLevel)}</span>}{r.reviewStatus&&<span>{pretty(r.reviewStatus)}</span>}</div>
     <h2><Link href={`/archive/${r.slug}`}>{r.title}</Link></h2>
     <p className={styles.path}>{r.documentId||'UNREGISTERED'} · {r.path}</p>
     <div className={styles.meta}>{r.documentType&&<span><b>{t.type}</b>{pretty(r.documentType)}</span>}{(r.periodStart||r.periodEnd)&&<span><b>{t.period}</b>{r.periodStart||'?'}–{r.periodEnd||'?'}</span>}{r.language&&<span><b>Lang</b>{r.language.toUpperCase()}</span>}{r.batch&&<span><b>Batch</b>{r.batch}</span>}</div>
     {!!r.topics.length&&<div className={styles.tags}>{r.topics.slice(0,5).map(x=><button key={x} onClick={()=>setTopic(x)}>{x}</button>)}</div>}
     <div className={styles.actions}><Link href={`/archive/${r.slug}`}>{t.open} ↗</Link><Link href={`/ask?q=${encodeURIComponent(r.title)}`}>{t.ask} →</Link></div>
    </div>
   </article>)}
   {!filtered.length&&<div className={styles.empty}><strong>{t.empty}</strong><button onClick={reset}>{t.reset}</button></div>}
  </section>
  <section className={styles.method}><span className="eyebrow">{t.method}</span><p>{t.methodText}</p></section>
 </main>
}

function Facet({label,value,set,values}:{label:string;value:string;set:(v:string)=>void;values:string[]}){return <label><span>{label}</span><select value={value} onChange={e=>set(e.target.value)}><option value="all">All</option>{values.map(v=><option key={v} value={v}>{pretty(v)}</option>)}</select></label>}
