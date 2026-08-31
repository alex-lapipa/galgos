'use client';

import Link from 'next/link';
import {usePathname,useSearchParams} from 'next/navigation';
import {useEffect,useMemo,useState} from 'react';
import {RESEARCH_CONTEXT_EVENT,type ResearchContextItem,type ResearchSurface} from '@/lib/research-context';
import styles from './ResearchSession.module.css';

const STORAGE='galgo7:research-trail:v1';
const MAX_ITEMS=12;

function surfaceFromPath(path:string):ResearchSurface{
 if(path.includes('/timeline'))return 'timeline';
 if(path.includes('/graph'))return 'graph';
 if(path.startsWith('/archive'))return 'archive';
 if(path.startsWith('/ask'))return 'ask';
 if(path.startsWith('/journey'))return 'journey';
 if(path.startsWith('/evidence'))return 'evidence';
 return 'other';
}
function routeLabel(path:string,q:string|null){
 if(path.startsWith('/ask')&&q)return q;
 if(path.startsWith('/archive/'))return decodeURIComponent(path.split('/').pop()||'Archive record').replaceAll('-',' ');
 if(path.includes('/timeline'))return 'Timeline';
 if(path.includes('/graph'))return 'Institutional graph';
 if(path.startsWith('/archive'))return 'Archive library';
 if(path.startsWith('/ask'))return 'Ask Archive';
 if(path.startsWith('/journey'))return 'Journey';
 if(path.startsWith('/evidence'))return 'Evidence';
 return 'GALGO/7';
}
function addUnique(items:ResearchContextItem[],item:ResearchContextItem){
 return [item,...items.filter(x=>x.id!==item.id)].slice(0,MAX_ITEMS);
}

export function ResearchSession(){
 const pathname=usePathname();
 const params=useSearchParams();
 const [items,setItems]=useState<ResearchContextItem[]>([]);
 const [open,setOpen]=useState(false);
 const [hydrated,setHydrated]=useState(false);
 const q=params.get('q');

 useEffect(()=>{
   try{const raw=localStorage.getItem(STORAGE);if(raw)setItems(JSON.parse(raw));}catch{}
   setHydrated(true);
 },[]);
 useEffect(()=>{
   if(!hydrated)return;
   const item:ResearchContextItem={id:`route:${pathname}:${q||''}`,surface:surfaceFromPath(pathname),kind:'route',label:routeLabel(pathname,q),href:`${pathname}${q?`?q=${encodeURIComponent(q)}`:''}`,at:Date.now()};
   setItems(prev=>addUnique(prev,item));
 },[hydrated,pathname,q]);
 useEffect(()=>{
   const handler=(event:Event)=>{
     const item=(event as CustomEvent<ResearchContextItem>).detail;
     if(!item?.label||!item?.href)return;
     setItems(prev=>addUnique(prev,item));
   };
   window.addEventListener(RESEARCH_CONTEXT_EVENT,handler as EventListener);
   return()=>window.removeEventListener(RESEARCH_CONTEXT_EVENT,handler as EventListener);
 },[]);
 useEffect(()=>{if(hydrated)try{localStorage.setItem(STORAGE,JSON.stringify(items));}catch{}},[items,hydrated]);

 const focus=items[0];
 const locale=pathname.startsWith('/es/')?'es':'en';
 const t=locale==='es'?{trail:'Ruta de investigación',continue:'Seguir investigando',ask:'Preguntar',timeline:'Cronología',graph:'Grafo',archive:'Archivo',clear:'Borrar ruta',empty:'La ruta aparecerá al abrir hechos, instituciones, documentos o preguntas.',note:'La ruta conserva contexto de navegación en este navegador. No es evidencia y nunca modifica la clasificación de una fuente.'}:{trail:'Research trail',continue:'Continue investigating',ask:'Ask',timeline:'Timeline',graph:'Graph',archive:'Archive',clear:'Clear trail',empty:'Your trail will appear as you open events, institutions, documents or questions.',note:'The trail preserves navigation context in this browser. It is not evidence and never changes a source classification.'};
 const question=focus?.label&&focus.label!=='Timeline'&&focus.label!=='Institutional graph'&&focus.label!=='Archive library'&&focus.label!=='Ask Archive'?focus.label:'';
 const actions=useMemo(()=>[
   {label:t.ask,href:`/ask${question?`?q=${encodeURIComponent(question)}`:''}`},
   {label:t.timeline,href:`/${locale}/timeline`},
   {label:t.graph,href:`/${locale}/graph`},
   {label:t.archive,href:`/archive${question?`?q=${encodeURIComponent(question)}`:''}`},
 ],[locale,question,t.ask,t.timeline,t.graph,t.archive]);
 const clear=()=>{setItems([]);try{localStorage.removeItem(STORAGE);}catch{}};
 if(!hydrated)return null;
 return <div className={`${styles.dock} ${open?styles.open:''}`}>
   <button className={styles.trigger} onClick={()=>setOpen(x=>!x)} aria-expanded={open}><span className={styles.pulse}/><b>{t.trail}</b>{focus&&<span>{focus.label}</span>}<i>{open?'×':items.length}</i></button>
   {open&&<div className={styles.panel}>
     <div className={styles.head}><div><span className="eyebrow">{t.trail}</span><strong>{focus?.label||t.empty}</strong></div>{!!items.length&&<button onClick={clear}>{t.clear}</button>}</div>
     <p className={styles.note}>{t.note}</p>
     <div className={styles.actions}><span>{t.continue}</span>{actions.map(a=><Link key={a.label} href={a.href}>{a.label} →</Link>)}</div>
     <div className={styles.list}>{items.length?items.map((item,i)=><Link href={item.href} key={item.id} className={styles.item}><span>{String(i+1).padStart(2,'0')}</span><div><b>{item.label}</b><small>{item.surface} · {item.kind}</small>{item.detail&&<em>{item.detail}</em>}</div></Link>):<p>{t.empty}</p>}</div>
   </div>}
 </div>;
}
