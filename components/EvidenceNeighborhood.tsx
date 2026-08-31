'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './EvidenceNeighborhood.module.css';
import type { TimelineEvent } from '@/lib/timeline-data';

type ContextDocument = {
  chunkId:string; documentId:string; title:string; repositoryPath:string; heading:string;
  lineStart:number; lineEnd:number; excerpt:string; score:number;
};
type ContextEdge = { source:string; edge_type:string; target:string; repository_path?:string; provenance?:unknown; confidence:number };
type ContextPayload = { documents:ContextDocument[]; edges:ContextEdge[] };

const colors=['var(--galgo-red)','var(--galgo-orange)','var(--galgo-gold)','var(--galgo-cyan)','var(--galgo-blue)'];

export function EvidenceNeighborhood({event,locale}:{event:TimelineEvent;locale:'en'|'es'}) {
  const [data,setData]=useState<ContextPayload|null>(null);
  const [error,setError]=useState(false);
  const copy=locale==='es'
    ? {kicker:'Vecindario de evidencia',title:'Qué documentos y entidades rodean este hito',loading:'Consultando RAG + grafo…',error:'No se pudo cargar el contexto conectado.',docs:'documentos',links:'conexiones',lines:'líneas'}
    : {kicker:'Evidence neighbourhood',title:'What documents and entities surround this event',loading:'Querying RAG + graph…',error:'Connected context could not be loaded.',docs:'documents',links:'connections',lines:'lines'};

  useEffect(()=>{
    const controller=new AbortController();
    setData(null); setError(false);
    fetch('/api/timeline-context',{
      method:'POST',headers:{'content-type':'application/json'},signal:controller.signal,
      body:JSON.stringify({title:event.title,summary:event.summary,source:event.source}),
    }).then(async response=>{
      if(!response.ok) throw new Error('context request failed');
      return response.json() as Promise<ContextPayload>;
    }).then(setData).catch(err=>{if(err?.name!=='AbortError')setError(true)});
    return ()=>controller.abort();
  },[event.id,event.title,event.summary,event.source]);

  const nodes=useMemo(()=>{
    if(!data) return [];
    const seen=new Set<string>();
    return data.edges.filter(edge=>{
      const key=`${edge.edge_type}:${edge.target}`;
      if(seen.has(key))return false;seen.add(key);return true;
    }).slice(0,12);
  },[data]);

  return <section className={styles.wrap} aria-live="polite">
    <div className={styles.head}><div><span>{copy.kicker}</span><strong>{copy.title}</strong></div>{data&&<div className={styles.meta}>{data.documents.length} {copy.docs} · {data.edges.length} {copy.links}</div>}</div>
    {!data&&!error&&<div className={styles.status}>{copy.loading}</div>}
    {error&&<div className={styles.status}>{copy.error}</div>}
    {data&&<>
      <div className={styles.graph}>
        <div className={styles.center}>{event.tag||event.title}</div>
        {nodes.map((node,index)=>{
          const angle=(Math.PI*2*index/Math.max(nodes.length,1))-Math.PI/2;
          const radius=nodes.length>8?41:36;
          const left=50+Math.cos(angle)*radius;
          const top=50+Math.sin(angle)*radius;
          return <button key={`${node.edge_type}-${node.target}`} className={styles.node} style={{left:`${left}%`,top:`${top}%`,'--node-color':colors[index%colors.length]} as React.CSSProperties} aria-label={`${node.edge_type}: ${node.target}`}>
            <span className={styles.tip}>{node.edge_type.replaceAll('_',' ')} → {node.target}</span>
          </button>;
        })}
      </div>
      <div className={styles.docs}>{data.documents.slice(0,4).map((doc,index)=><article key={doc.chunkId} className={styles.doc}>
        <div className={styles.rank}>{String(index+1).padStart(2,'0')}</div><div><h4>{doc.title}</h4><p>{doc.excerpt}</p></div><div className={styles.lines}>{copy.lines} {doc.lineStart}–{doc.lineEnd}</div>
      </article>)}</div>
    </>}
  </section>;
}
