'use client';

import Link from 'next/link';
import {FormEvent,useEffect,useMemo,useState} from 'react';
import styles from './AskArchive.module.css';

type Locale='en'|'es';
type Citation={id:number;title:string;path:string;slug:string|null;heading:string;lines:[number,number];score:number;corpusStatus:string;evidenceLevel:string;reviewStatus:string|null;sourceQuality:string|null;documentType:string|null;excerpt:string;used:boolean};
type GraphEdge={source:string;edge_type:string;target:string;repository_path:string|null;provenance:unknown;confidence:number|string};
type Result={answer:string;citations:Citation[];graph:GraphEdge[];retrieved:number;usedCitationIds:number[];matchedGraphLabels:string[];models?:{embedding:string;generation:string}};

const prompts={
 en:[
  'What is the earliest secure evidence for galgo-type dogs in Iberia?',
  'What does the archive actually establish about Roman-era continuity?',
  'How did the social role of the galgo change from medieval law to modern coursing?',
  'What does Yo Galgo document, and what impact can be supported without overstating causality?',
  'What are the documented institutional relationships around Ley 7/2023?',
  'What do competing abandonment estimates measure, and why are they not directly comparable?',
 ],
 es:[
  '¿Cuál es la evidencia segura más antigua de perros tipo galgo en Iberia?',
  '¿Qué establece realmente el archivo sobre la continuidad desde época romana?',
  '¿Cómo cambió el papel social del galgo desde el derecho medieval hasta la competición moderna?',
  '¿Qué documenta Yo Galgo y qué impacto puede sostenerse sin exagerar la causalidad?',
  '¿Cuáles son las relaciones institucionales documentadas en torno a la Ley 7/2023?',
  '¿Qué miden las distintas estimaciones de abandono y por qué no son directamente comparables?',
 ],
} as const;

const copy={
 en:{kicker:'Research cockpit · retrieval + provenance',title:'Ask what the archive can actually prove.',dek:'A citation-first research interface across the Galgo Español corpus. Answers stay inside retrieved evidence, surface disagreement and uncertainty, and connect directly back to sources, timeline and institutional graph.',placeholder:'Ask a historical, cultural, legal or institutional question…',ask:'Ask archive',asking:'Reading the archive…',suggested:'Research starting points',sources:'Evidence used',allSources:'Retrieved evidence',graph:'Explicit graph context',graphEmpty:'No explicit institutional graph entity was named in this question.',method:'Evidence discipline',methodText:'Retrieval similarity is not proof. The answer may synthesize retrieved passages, but it cannot upgrade uncertainty, infer ancestry from resemblance, or turn institutional opposition into causal claims.',noAnswer:'Ask a question or choose a research starting point.',error:'The archive could not complete this retrieval. Please try again.',archive:'Open source',timeline:'Explore timeline',institutional:'Open institutional graph',library:'Browse archive',continue:'Continue research',retrieved:'passages retrieved',cited:'sources cited',language:'ES',technical:'Retrieval metadata',canonical:'canonical',legacy:'legacy',methodology:'methodology'},
 es:{kicker:'Mesa de investigación · recuperación + procedencia',title:'Pregunta lo que el archivo realmente puede demostrar.',dek:'Una interfaz de investigación basada en citas para todo el corpus del Galgo Español. Las respuestas permanecen dentro de la evidencia recuperada, muestran desacuerdos e incertidumbre y enlazan directamente con fuentes, cronología y grafo institucional.',placeholder:'Pregunta sobre historia, cultura, derecho o instituciones…',ask:'Preguntar al archivo',asking:'Leyendo el archivo…',suggested:'Puntos de partida',sources:'Evidencia utilizada',allSources:'Evidencia recuperada',graph:'Contexto explícito del grafo',graphEmpty:'La pregunta no menciona ninguna entidad institucional explícita del grafo.',method:'Disciplina de evidencia',methodText:'La similitud de recuperación no es prueba. La respuesta puede sintetizar pasajes recuperados, pero no puede elevar la incertidumbre, inferir ascendencia por parecido ni convertir oposición institucional en causalidad.',noAnswer:'Formula una pregunta o elige un punto de partida.',error:'El archivo no pudo completar esta recuperación. Inténtalo de nuevo.',archive:'Abrir fuente',timeline:'Explorar cronología',institutional:'Abrir grafo institucional',library:'Ver archivo',continue:'Continuar investigación',retrieved:'pasajes recuperados',cited:'fuentes citadas',language:'EN',technical:'Metadatos de recuperación',canonical:'canónico',legacy:'legado',methodology:'metodología'},
} as const;

function AnswerText({text}:{text:string}){
 const paragraphs=text.split(/\n\s*\n/).filter(Boolean);
 return <>{paragraphs.map((paragraph,i)=><p key={i}>{paragraph.split(/(\[\d+\])/g).filter(Boolean).map((part,j)=>{const m=part.match(/^\[(\d+)\]$/);return m?<a key={j} className={styles.cite} href={`#source-${m[1]}`} aria-label={`Source ${m[1]}`}>{part}</a>:part})}</p>)}</>;
}

function statusLabel(value:string,locale:Locale){return value.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase())+(locale==='es'&&value==='unverified'?' · no verificado':'');}

export function AskArchive(){
 const [locale,setLocale]=useState<Locale>('en');
 const [question,setQuestion]=useState('');
 const [result,setResult]=useState<Result|null>(null);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState(false);
 const t=copy[locale];

 useEffect(()=>{
  const params=new URLSearchParams(window.location.search);
  const q=params.get('q');const lang=params.get('lang');
  const preferred:Locale=lang==='es'||(!lang&&navigator.language.toLowerCase().startsWith('es'))?'es':'en';
  setLocale(preferred);if(q){setQuestion(q);void run(q,preferred)}
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);

 async function run(q:string,lang:Locale=locale){
  const clean=q.trim();if(clean.length<3)return;
  setLoading(true);setError(false);setResult(null);
  try{
   const response=await fetch('/api/ask',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:clean,locale:lang})});
   if(!response.ok)throw new Error('ask');
   const data=await response.json() as Result;setResult(data);
   const url=new URL(window.location.href);url.searchParams.set('q',clean);url.searchParams.set('lang',lang);window.history.replaceState({},'',url);
  }catch{setError(true)}finally{setLoading(false)}
 }
 function submit(e:FormEvent){e.preventDefault();void run(question)}
 function switchLocale(){const next:Locale=locale==='en'?'es':'en';setLocale(next);if(result)void run(question,next)}
 const ordered=useMemo(()=>result?.citations.slice().sort((a,b)=>Number(b.used)-Number(a.used)||a.id-b.id)??[],[result]);
 const used=result?.citations.filter(c=>c.used).length??0;

 return <main className={styles.page}>
  <section className={styles.hero}>
   <div><span className="eyebrow">{t.kicker}</span><h1>{t.title}</h1><p>{t.dek}</p></div>
   <button className={styles.language} onClick={switchLocale}>{t.language}</button>
  </section>

  <section className={`${styles.queryPanel} glass-panel`}>
   <form onSubmit={submit} className={styles.form}>
    <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder={t.placeholder} rows={3} maxLength={1600}/>
    <button disabled={loading||question.trim().length<3}>{loading?t.asking:t.ask}</button>
   </form>
   <div className={styles.discipline}><span>{t.method}</span><p>{t.methodText}</p></div>
  </section>

  {!result&&!loading&&!error&&<section className={styles.starters}><span className="eyebrow">{t.suggested}</span><div>{prompts[locale].map((p,i)=><button key={p} onClick={()=>{setQuestion(p);void run(p)}}><b>{String(i+1).padStart(2,'0')}</b><span>{p}</span><i>↗</i></button>)}</div></section>}
  {loading&&<section className={styles.loading}><div className={styles.pulse}/><span>{t.asking}</span><small>{locale==='es'?'Búsqueda híbrida → síntesis citada':'Hybrid retrieval → cited synthesis'}</small></section>}
  {error&&<section className={styles.error}>{t.error}</section>}

  {result&&<section className={styles.workspace}>
   <article className={styles.answer}>
    <div className={styles.answerHead}><span className="eyebrow">Ask Archive</span><div><span>{result.retrieved} {t.retrieved}</span><span>{used} {t.cited}</span></div></div>
    <h2>{question}</h2>
    <div className={styles.prose}><AnswerText text={result.answer}/></div>
    <div className={styles.continue}><span>{t.continue}</span><div><Link href={locale==='es'?'/es/timeline':'/en/timeline'}>{t.timeline} ↗</Link><Link href={locale==='es'?'/es/graph':'/en/graph'}>{t.institutional} ↗</Link><Link href="/archive">{t.library} ↗</Link></div></div>
   </article>

   <aside className={styles.evidenceRail}>
    <div className={styles.railHead}><span className="eyebrow">{used?t.sources:t.allSources}</span><strong>{ordered.length}</strong></div>
    <div className={styles.cards}>{ordered.map(c=><article id={`source-${c.id}`} key={`${c.id}-${c.path}`} className={`${styles.sourceCard} ${c.used?styles.used:''}`}>
      <div className={styles.sourceTop}><b>[{c.id}]</b><div>{c.used&&<span className={styles.usedTag}>{locale==='es'?'citada':'cited'}</span>}<span className={styles.corpus}>{c.corpusStatus==='canonical'?t.canonical:c.corpusStatus==='legacy'?t.legacy:t.methodology}</span></div></div>
      <h3>{c.title}</h3><p className={styles.heading}>{c.heading||'—'}</p>
      <div className={styles.meta}><span>{statusLabel(c.evidenceLevel,locale)}</span>{c.reviewStatus&&<span>{c.reviewStatus}</span>}</div>
      <p className={styles.excerpt}>{c.excerpt}</p>
      <small>{c.path} · {locale==='es'?'líneas':'lines'} {c.lines[0]}–{c.lines[1]}</small>
      {c.slug&&<Link href={`/archive/${c.slug}`}>{t.archive} ↗</Link>}
    </article>)}</div>
   </aside>
  </section>}

  {result&&<section className={styles.lower}>
   <div className={`${styles.graphPanel} glass-panel`}><div className={styles.panelTitle}><span className="eyebrow">{t.graph}</span><strong>{result.graph.length}</strong></div>{result.graph.length?<div className={styles.graphList}>{result.graph.map((g,i)=><Link key={`${g.source}-${g.edge_type}-${g.target}-${i}`} href={locale==='es'?'/es/graph':'/en/graph'}><span>{g.source}</span><b>{g.edge_type.replaceAll('_',' ')}</b><span>{g.target}</span><i>↗</i></Link>)}</div>:<p>{t.graphEmpty}</p>}</div>
   <div className={`${styles.techPanel} glass-panel`}><span className="eyebrow">{t.technical}</span><dl><div><dt>Embedding</dt><dd>{result.models?.embedding??'—'}</dd></div><div><dt>Generation</dt><dd>{result.models?.generation??'—'}</dd></div><div><dt>Graph labels</dt><dd>{result.matchedGraphLabels?.join(', ')||'—'}</dd></div></dl><p>{locale==='es'?'Los modelos realizan recuperación y síntesis; no determinan la calidad factual de la evidencia.':'Models perform retrieval and synthesis; they do not determine factual evidence quality.'}</p></div>
  </section>}
 </main>;
}
