import Link from 'next/link';
import {eras,timelineEvents,type ContinuityDimension,type EvidenceLevel} from '@/lib/timeline-data';
import styles from './ContinuityMatrix.module.css';

const dims:{key:ContinuityDimension;label:string;short:string;definition:string}[]=[
 {key:'function',label:'Function',short:'Function',definition:'Evidence that dogs were used for coursing, sight-hunting or a comparable role.'},
 {key:'type',label:'Morphological type',short:'Type',definition:'Evidence for a gracile, long-legged or otherwise sighthound-like body plan.'},
 {key:'population',label:'Population',short:'Population',definition:'Evidence for actual breeding-population transmission rather than analogy or convergent selection.'},
 {key:'name',label:'Name',short:'Name',definition:'Evidence for terminology and whether its referent is stable across time.'},
 {key:'breed',label:'Formal breed',short:'Breed',definition:'Evidence for modern institutional breed identity, standards or registration.'},
];
const order:EvidenceLevel[]=['confirmed','probable','plausible','disputed','traditional','unsupported','disproven'];
const labels:Record<EvidenceLevel,string>={confirmed:'Confirmed',probable:'Probable',plausible:'Plausible',disputed:'Disputed',traditional:'Traditional',unsupported:'Unsupported',disproven:'Disproven'};

function cell(era:number,dim:ContinuityDimension){
 const events=timelineEvents.filter(event=>event.era===era&&event.dimensions.includes(dim));
 const counts=order.map(level=>({level,count:events.filter(event=>event.evidence===level).length})).filter(x=>x.count);
 return {events,counts};
}

export function ContinuityMatrix(){
 return <main className={styles.page}><div className={styles.inner}>
  <section className={styles.hero}><span className="eyebrow">Evidence observatory · five continuities</span><h1>There is no single ancestry score.</h1><p>The archive separates continuity of function, body type, population, name and formal breed. This matrix shows where the Timeline contains evidence for each dimension—and how that evidence is classified.</p><div className={styles.rule}><strong>Read this as evidence coverage, not a verdict.</strong> A cell may contain confirmed and unsupported records at the same time because different claims within the same period can have different evidentiary status.</div></section>
  <section className={styles.definitions}>{dims.map(d=><article key={d.key}><span>{d.short}</span><p>{d.definition}</p></article>)}</section>
  <section className={styles.matrixWrap} aria-label="Five-continuity evidence matrix"><div className={styles.matrix}>
   <div className={`${styles.headCell} ${styles.eraHead}`}>Period</div>{dims.map(d=><div className={styles.headCell} key={d.key}>{d.label}</div>)}
   {eras.map(era=><div className={styles.row} key={era.id}>
    <div className={styles.eraCell}><b>{era.n}</b><div><strong>{era.title}</strong><span>{era.period}</span></div></div>
    {dims.map(dim=>{const data=cell(era.id,dim.key);return <div className={styles.cell} key={dim.key}>{data.events.length?<><div className={styles.cellTop}><strong>{data.events.length}</strong><span>{data.events.length===1?'record':'records'}</span></div><div className={styles.counts}>{data.counts.map(c=><span key={c.level} data-level={c.level}>{c.count} {labels[c.level]}</span>)}</div><div className={styles.events}>{data.events.slice(0,3).map(event=><Link key={event.id} href={`/en/timeline?event=${event.id}`} title={event.summary}>{event.date} · {event.title}</Link>)}{data.events.length>3&&<small>+{data.events.length-3} more</small>}</div></>:<span className={styles.none}>No tagged record yet</span>}</div>})}
   </div>)}
  </div></section>
  <section className={styles.mobileList}>{eras.map(era=><article className={styles.eraCard} key={era.id}><header><b>{era.n}</b><div><h2>{era.title}</h2><span>{era.period}</span></div></header>{dims.map(dim=>{const data=cell(era.id,dim.key);return <div className={styles.mobileDimension} key={dim.key}><div><strong>{dim.short}</strong><span>{data.events.length?`${data.events.length} tagged ${data.events.length===1?'record':'records'}`:'No tagged record yet'}</span></div>{data.events.length>0&&<div className={styles.mobileEvidence}>{data.counts.map(c=><span key={c.level} data-level={c.level}>{c.count} {labels[c.level]}</span>)}</div>}{data.events.slice(0,2).map(event=><Link key={event.id} href={`/en/timeline?event=${event.id}`}>{event.date} · {event.title} →</Link>)}</div>})}</article>)}</section>
  <aside className={styles.method}><span className="eyebrow">How to interpret the matrix</span><h2>Evidence density is not historical certainty.</h2><p>A period with many records may simply be better documented. A blank cell means no Timeline event is currently tagged to that dimension; it does not prove absence. Clicking a record opens the exact Timeline event and its evidence context.</p><div><Link href="/claims">Open Claim Ledger →</Link><Link href="/archive/claim-classification-framework">Read classification framework →</Link><Link href="/ask?q=Explain%20the%20five%20continuity%20dimensions%20used%20by%20GALGOS">Ask Archive →</Link></div></aside>
 </div></main>
}
