'use client';

import Link from 'next/link';
import {useMemo,useState} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import {eras,timelineEvents,type EvidenceLevel,type TimelineEvent} from '@/lib/timeline-data';
import {spanishDates,spanishSummaries} from '@/lib/timeline-es';
import {emitResearchContext} from '@/lib/research-context';
import {EvidenceNeighborhood} from '@/components/EvidenceNeighborhood';
import styles from './MobileTimeline.module.css';

const levels:EvidenceLevel[]=['confirmed','probable','plausible','disputed','traditional','unsupported','disproven'];
const levelCopy={en:{confirmed:'Confirmed',probable:'Probable',plausible:'Plausible',disputed:'Disputed',traditional:'Traditional',unsupported:'Unsupported',disproven:'Disproven'},es:{confirmed:'Confirmado',probable:'Probable',plausible:'Plausible',disputed:'Disputado',traditional:'Tradicional',unsupported:'No respaldado',disproven:'Refutado'}} as const;
const eraEs=['Prehistoria profunda','Europa de la Edad del Hierro','Grecia y Roma','Hispania visigoda','Al-Ándalus','Iberia medieval','Iberia moderna temprana','De los Borbones a la Restauración','El siglo del canódromo','Ley, genoma y rescate'];
const copy={en:{kicker:'Mobile research timeline',title:'The history, one evidence record at a time.',dek:'A phone-first chronological view of the same 98-event research timeline. Evidence status and continuity tags stay visible as you move through time.',all:'All evidence',events:'records',open:'Open evidence',source:'Source',close:'Close',ask:'Ask Archive',dimensions:'Continuity'},es:{kicker:'Cronología móvil de investigación',title:'La historia, evidencia por evidencia.',dek:'Una lectura cronológica pensada para móvil de los mismos 98 hitos. La clasificación de evidencia y las dimensiones de continuidad permanecen visibles.',all:'Toda la evidencia',events:'registros',open:'Abrir evidencia',source:'Fuente',close:'Cerrar',ask:'Preguntar al Archivo',dimensions:'Continuidad'}} as const;

function localEvent(event:TimelineEvent,locale:'en'|'es'){
 if(locale==='en')return event;
 return {...event,date:spanishDates[event.date]??event.date,summary:spanishSummaries[event.id]??event.summary};
}

export function MobileTimeline({locale}:{locale:'en'|'es'}){
 const router=useRouter();const params=useSearchParams();const t=copy[locale];
 const [level,setLevel]=useState<EvidenceLevel|'all'>('all');
 const selectedId=params.get('event');const selectedRaw=timelineEvents.find(event=>event.id===selectedId)||null;const selected=selectedRaw?localEvent(selectedRaw,locale):null;
 const grouped=useMemo(()=>eras.map((era,index)=>({era,index,events:timelineEvents.filter(event=>event.era===era.id&&(level==='all'||event.evidence===level))})).filter(group=>group.events.length),[level]);
 const open=(raw:TimelineEvent)=>{const next=new URLSearchParams(params.toString());next.set('event',raw.id);router.replace(`?${next.toString()}`,{scroll:false});const event=localEvent(raw,locale);emitResearchContext({surface:'timeline',kind:'event',label:`${event.date} · ${event.title}`,href:`/${locale}/timeline?event=${raw.id}`,detail:`${levelCopy[locale][raw.evidence]} · ${raw.dimensions.join(', ')||'context record'}`})};
 const close=()=>{const next=new URLSearchParams(params.toString());next.delete('event');router.replace(next.toString()?`?${next.toString()}`:`/${locale}/timeline`,{scroll:false})};
 return <main className={styles.mobile}>
  <section className={styles.hero}><span className="eyebrow">{t.kicker}</span><h1>{t.title}</h1><p>{t.dek}</p><div className={styles.stats}><span><b>{timelineEvents.length}</b>{t.events}</span><span><b>10</b>{locale==='es'?'épocas':'eras'}</span><span><b>7</b>{locale==='es'?'niveles':'levels'}</span></div></section>
  <div className={styles.filter} aria-label={locale==='es'?'Filtrar evidencia':'Filter evidence'}><button className={level==='all'?styles.on:''} onClick={()=>setLevel('all')}>{t.all}</button>{levels.map(item=><button key={item} data-level={item} className={level===item?styles.on:''} onClick={()=>setLevel(item)}>{levelCopy[locale][item]}</button>)}</div>
  <section className={styles.feed}>{grouped.map(({era,index,events})=><section className={styles.era} key={era.id}><header><span>{era.n}</span><div><h2>{locale==='es'?eraEs[index]:era.title}</h2><p>{era.period} · {events.length} {t.events}</p></div></header><div className={styles.events}>{events.map(raw=>{const event=localEvent(raw,locale);return <button key={raw.id} className={styles.event} onClick={()=>open(raw)} aria-label={`${event.date}: ${event.title}`}><div className={styles.date}>{event.date}</div><div className={styles.eventBody}><div className={styles.badges}><span data-level={raw.evidence}>{levelCopy[locale][raw.evidence]}</span>{raw.dimensions.map(dim=><span key={dim} className={styles.dimension}>{dim==='breed'?(locale==='es'?'raza formal':'formal breed'):dim}</span>)}</div><h3>{event.title}</h3><p>{event.summary}</p><small>{t.open} →</small></div></button>})}</div></section>)}</section>
  {selected&&selectedRaw&&<div className={styles.backdrop} role="presentation" onClick={e=>{if(e.currentTarget===e.target)close()}}><section className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="mobile-event-title"><div className={styles.sheetHead}><div><span>{selected.date} · {levelCopy[locale][selectedRaw.evidence]}</span><h2 id="mobile-event-title">{selected.title}</h2></div><button onClick={close} aria-label={t.close}>×</button></div><p className={styles.sheetSummary}>{selected.summary}</p><div className={styles.sheetMeta}><div><span>{t.dimensions}</span><p>{selectedRaw.dimensions.length?selectedRaw.dimensions.join(' · '):'—'}</p></div><div><span>{t.source}</span><p>{selected.source}</p></div></div><div className={styles.actions}><Link href={`/ask?q=${encodeURIComponent(`What does the archive support about ${selected.title}?`)}`}>{t.ask} →</Link><button onClick={close}>{t.close}</button></div><EvidenceNeighborhood event={selectedRaw} locale={locale}/></section></div>}
 </main>;
}
