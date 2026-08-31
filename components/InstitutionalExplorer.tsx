'use client';

import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {graphSourceSlug,institutionalEdges,institutionalNodes,type InstitutionalEdge,type InstitutionalNode} from '@/lib/institutional-map';
import styles from './InstitutionalExplorer.module.css';

type ContextDocument={chunkId:string;documentId:string;title:string;repositoryPath:string;heading:string;lineStart:number;lineEnd:number;excerpt:string;score:number};
type Selection={kind:'node';node:InstitutionalNode}|{kind:'edge';edge:InstitutionalEdge};
type View='landscape'|'law'|'rescue'|'governance';

const typeColor:Record<string,string>={
 RESCUE_SHELTER:'var(--galgo-cyan)',RESCUE_NETWORK_INTL:'var(--galgo-blue)',HUNTING_FEDERATION:'var(--galgo-orange)',BREED_KENNEL_CLUB:'var(--galgo-gold)',GOVERNMENT_AGENCY:'var(--galgo-red)',UMBRELLA_COALITION:'var(--galgo-cyan)',POLITICAL_PARTY:'var(--galgo-red)',ADVOCACY_POLICY:'var(--galgo-cyan)',LEGAL:'var(--galgo-blue)',VETERINARY_SCIENTIFIC:'var(--galgo-gold)',LAW:'var(--galgo-red)',POLICY:'var(--galgo-red)',EVENT:'var(--galgo-orange)'
};
const edgeDash:Record<string,string>={OPPOSED_TO:'7 6',PARTNER_OF:'0',FUNDER_OF:'2 5',COLLABORATES_WITH:'4 4',MEMBER_OF:'0',HOSTS_EVENT:'0',REGULATES_VIA:'10 4'};

const copy={
 en:{kicker:'Institutional landscape · evidence map',title:'The galgo sits inside several systems at once.',dek:'Rescue, hunting, breed governance, public administration, advocacy, law and science overlap — but they do not mean the same thing. This map shows only relationships explicitly supported in the canonical corpus.',views:{landscape:'Landscape',law:'Ley 7/2023',rescue:'Rescue network',governance:'Governance'},search:'Search institutions',relations:'Relationships',types:'Institution types',stances:'Stances',source:'Evidence & provenance',empty:'Select a node or relationship to inspect its supporting corpus passages.',loading:'Retrieving supporting evidence from Neon…',error:'Supporting passages could not be loaded.',ask:'Ask the archive',archive:'Open canonical source',lines:'lines',direct:'Direct relationships',method:'How to read this map',methodText:'Position is a semantic layout choice, not evidence of influence. Edge types describe documented relationships only. OPPOSED_TO does not imply equal power, equal evidence quality, moral equivalence or causality.',all:'All',anti:'Anti-hunting',pro:'Pro-hunting',reg:'Regulatory',welfare:'Welfare / neutral',noResults:'No institutions match the active filters.'},
 es:{kicker:'Paisaje institucional · mapa de evidencia',title:'El galgo habita varios sistemas a la vez.',dek:'Rescate, caza, gobernanza de raza, administración pública, activismo, derecho y ciencia se solapan, pero no significan lo mismo. Este mapa muestra únicamente relaciones explícitamente respaldadas por el corpus canónico.',views:{landscape:'Panorama',law:'Ley 7/2023',rescue:'Red de rescate',governance:'Gobernanza'},search:'Buscar instituciones',relations:'Relaciones',types:'Tipos de institución',stances:'Posiciones',source:'Evidencia y procedencia',empty:'Selecciona un nodo o una relación para consultar los pasajes que la respaldan.',loading:'Consultando evidencia de apoyo en Neon…',error:'No se pudieron cargar los pasajes de apoyo.',ask:'Preguntar al archivo',archive:'Abrir fuente canónica',lines:'líneas',direct:'Relaciones directas',method:'Cómo leer este mapa',methodText:'La posición es una decisión semántica de diseño, no evidencia de influencia. Los tipos de línea describen solo relaciones documentadas. OPPOSED_TO no implica igual poder, igual calidad de evidencia, equivalencia moral ni causalidad.',all:'Todo',anti:'Anti-caza',pro:'Pro-caza',reg:'Regulatorio',welfare:'Bienestar / neutral',noResults:'Ninguna institución coincide con los filtros activos.'}
} as const;

const viewNodes:Record<View,Set<string>>={
 landscape:new Set(institutionalNodes.map(n=>n.id)),
 law:new Set(['law','exemption','dgda','rfec','nac','pacma','anima','cas','sos-galgos']),
 rescue:new Set(['sos-galgos','scooby','fbm','gds','gdsur','g112','carlota','gin','grin','project-galgo','sage','intercids','pacma']),
 governance:new Set(['feg','rfec','rsce','cnge','fci','dgda','mapa','seprona','law','exemption','championship']),
};

function nodeQuery(n:InstitutionalNode){return `${n.label}\nInstitutional role: ${n.type}\nStance: ${n.stance??'not classified'}\nGalgo Español institutional landscape`;}
function edgeQuery(e:InstitutionalEdge){const s=institutionalNodes.find(n=>n.id===e.source)?.label??e.source;const t=institutionalNodes.find(n=>n.id===e.target)?.label??e.target;return `${s} ${e.predicate.replaceAll('_',' ')} ${t}\nGalgo Español institutional relationship`;}
function displayType(type:string){return type.replaceAll('_',' ').toLowerCase();}

export function InstitutionalExplorer({locale}:{locale:'en'|'es'}){
 const t=copy[locale];
 const [view,setView]=useState<View>('landscape');
 const [query,setQuery]=useState('');
 const [stance,setStance]=useState('ALL');
 const [relation,setRelation]=useState('ALL');
 const [selection,setSelection]=useState<Selection|null>(null);
 const [docs,setDocs]=useState<ContextDocument[]>([]);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState(false);

 const predicates=useMemo(()=>[...new Set(institutionalEdges.map(e=>e.predicate))],[]);
 const nodes=useMemo(()=>institutionalNodes.filter(n=>{
   if(!viewNodes[view].has(n.id))return false;
   if(query&&!n.label.toLowerCase().includes(query.toLowerCase()))return false;
   if(stance!=='ALL'&&n.stance!==stance)return false;
   return true;
 }),[view,query,stance]);
 const nodeIds=useMemo(()=>new Set(nodes.map(n=>n.id)),[nodes]);
 const edges=useMemo(()=>institutionalEdges.filter(e=>nodeIds.has(e.source)&&nodeIds.has(e.target)&&(relation==='ALL'||e.predicate===relation)),[nodeIds,relation]);
 const visibleNodeIds=useMemo(()=>new Set([...edges.flatMap(e=>[e.source,e.target]),...nodes.filter(n=>query||stance!=='ALL').map(n=>n.id)]),[edges,nodes,query,stance]);
 const visibleNodes=nodes.filter(n=>view==='landscape'&&!query&&stance==='ALL'&&relation==='ALL'||visibleNodeIds.has(n.id));

 useEffect(()=>{
   if(!selection){setDocs([]);setError(false);return;}
   const q=selection.kind==='node'?nodeQuery(selection.node):edgeQuery(selection.edge);
   const controller=new AbortController();setLoading(true);setError(false);setDocs([]);
   fetch('/api/institutional-context',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query:q}),signal:controller.signal})
    .then(async r=>{if(!r.ok)throw new Error('context');return r.json() as Promise<{documents:ContextDocument[]}>})
    .then(d=>setDocs(d.documents.filter(x=>x.repositoryPath==='Institutional_Map_Galgo_Espanol_2026.md'||x.repositoryPath.startsWith('compass_artifact_')).slice(0,4)))
    .catch(e=>{if(e?.name!=='AbortError')setError(true)}).finally(()=>setLoading(false));
   return()=>controller.abort();
 },[selection]);

 const selectedNode=selection?.kind==='node'?selection.node:null;
 const selectedEdge=selection?.kind==='edge'?selection.edge:null;
 const direct=selectedNode?institutionalEdges.filter(e=>e.source===selectedNode.id||e.target===selectedNode.id):[];
 const selQuery=selection?selection.kind==='node'?selection.node.label:edgeQuery(selection.edge):'';

 return <main className={styles.page}>
  <section className={styles.hero}>
   <span className="eyebrow">{t.kicker}</span><h1>{t.title}</h1><p>{t.dek}</p>
   <div className={styles.heroMeta}><span>30 {locale==='es'?'nodos curados':'curated nodes'}</span><span>17 {locale==='es'?'relaciones explícitas':'explicit relationships'}</span><span>1 {locale==='es'?'fuente canónica':'canonical source'}</span></div>
  </section>

  <section className={`${styles.toolbar} glass-panel`}>
   <div className={styles.viewTabs}>{(Object.keys(t.views) as View[]).map(v=><button key={v} onClick={()=>{setView(v);setSelection(null)}} className={view===v?styles.active:''}>{t.views[v]}</button>)}</div>
   <label className={styles.search}><span>{t.search}</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={locale==='es'?'Nombre de organización…':'Organization name…'}/></label>
   <div className={styles.filters}>
    <label><span>{t.stances}</span><select value={stance} onChange={e=>setStance(e.target.value)}><option value="ALL">{t.all}</option><option value="ANTI_HUNTING">{t.anti}</option><option value="PRO_HUNTING">{t.pro}</option><option value="REGULATORY">{t.reg}</option><option value="WELFARE_NEUTRAL">{t.welfare}</option></select></label>
    <label><span>{t.relations}</span><select value={relation} onChange={e=>setRelation(e.target.value)}><option value="ALL">{t.all}</option>{predicates.map(p=><option key={p}>{p}</option>)}</select></label>
   </div>
  </section>

  <section className={styles.workspace}>
   <div className={styles.canvasWrap}>
    <div className={styles.zoneLabels} aria-hidden="true"><span className={styles.zRescue}>{locale==='es'?'Rescate + adopción internacional':'Rescue + international adoption'}</span><span className={styles.zGov}>{locale==='es'?'Caza + cinología + gobierno':'Hunting + cynology + government'}</span><span className={styles.zPolicy}>{locale==='es'?'Política / ley':'Policy / law'}</span><span className={styles.zAdv}>{locale==='es'?'Activismo + legal + ciencia':'Advocacy + legal + science'}</span></div>
    <svg className={styles.edges} viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">
     <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>
     {edges.map(e=>{const s=institutionalNodes.find(n=>n.id===e.source)!;const d=institutionalNodes.find(n=>n.id===e.target)!;const active=selectedEdge?.id===e.id||selectedNode&&(e.source===selectedNode.id||e.target===selectedNode.id);return <line key={e.id} x1={s.x*10} y1={s.y*7.6} x2={d.x*10} y2={d.y*7.6} className={`${styles.edge} ${styles[`edge_${e.predicate}`]??''} ${active?styles.edgeActive:''}`} strokeDasharray={edgeDash[e.predicate]} markerEnd="url(#arrow)"/>})}
    </svg>
    <div className={styles.edgeHitLayer}>{edges.map(e=>{const s=institutionalNodes.find(n=>n.id===e.source)!;const d=institutionalNodes.find(n=>n.id===e.target)!;const mx=(s.x+d.x)/2,my=(s.y+d.y)/2;return <button key={e.id} className={styles.edgeHit} style={{left:`${mx}%`,top:`${my}%`}} onClick={()=>setSelection({kind:'edge',edge:e})} aria-label={`${institutionalNodes.find(n=>n.id===e.source)?.label} ${e.predicate} ${institutionalNodes.find(n=>n.id===e.target)?.label}`}><span>{e.predicate.replaceAll('_',' ')}</span></button>})}</div>
    {visibleNodes.map(n=><button key={n.id} onClick={()=>setSelection({kind:'node',node:n})} className={`${styles.node} ${selection?.kind==='node'&&selection.node.id===n.id?styles.nodeActive:''}`} style={{left:`${n.x}%`,top:`${n.y}%`,'--node-color':typeColor[n.type]??'var(--ice)'} as React.CSSProperties}>
      <i/><span className={styles.nodeLabel}>{n.label}</span><small>{displayType(n.type)}</small>
    </button>)}
    {!visibleNodes.length&&<div className={styles.noResults}>{t.noResults}</div>}
   </div>

   <aside className={styles.drawer}>
    <div className={styles.drawerHeader}><span>{t.source}</span>{selection&&<button onClick={()=>setSelection(null)} aria-label="Close">×</button>}</div>
    {!selection&&<div className={styles.empty}><div className={styles.evidenceMark}>↗</div><p>{t.empty}</p><div className={styles.method}><strong>{t.method}</strong><p>{t.methodText}</p></div></div>}
    {selection&&<div className={styles.detail}>
      {selectedNode&&<><span className={styles.kind}>{displayType(selectedNode.type)}</span><h2>{selectedNode.label}</h2>{selectedNode.stance&&<span className={styles.stance}>{selectedNode.stance.replaceAll('_',' ')}</span>}<h3>{t.direct}</h3><div className={styles.direct}>{direct.map(e=>{const other=institutionalNodes.find(n=>n.id===(e.source===selectedNode.id?e.target:e.source));return <button key={e.id} onClick={()=>setSelection({kind:'edge',edge:e})}><b>{e.predicate.replaceAll('_',' ')}</b><span>{other?.label}</span></button>})}</div></>}
      {selectedEdge&&<><span className={styles.kind}>{selectedEdge.predicate.replaceAll('_',' ')}</span><h2>{institutionalNodes.find(n=>n.id===selectedEdge.source)?.label}</h2><div className={styles.arrow}>↓ <span>{selectedEdge.predicate.replaceAll('_',' ')}</span></div><h2>{institutionalNodes.find(n=>n.id===selectedEdge.target)?.label}</h2><p className={styles.caveat}>{t.methodText}</p></>}
      <div className={styles.actions}><Link href={`/archive/${graphSourceSlug}`}>{t.archive}</Link><Link href={`/ask?q=${encodeURIComponent(selQuery)}`}>{t.ask}</Link></div>
      <div className={styles.passages}>{loading&&<p>{t.loading}</p>}{error&&<p>{t.error}</p>}{!loading&&!error&&docs.map((d,i)=><article key={d.chunkId}><div className={styles.rank}>{String(i+1).padStart(2,'0')}</div><div><strong>{d.heading||d.title}</strong><p>{d.excerpt}</p><small>{d.repositoryPath} · {t.lines} {d.lineStart}–{d.lineEnd}</small></div></article>)}</div>
    </div>}
   </aside>
  </section>

  <section className={styles.legend}>
   <div><span className="eyebrow">{t.relations}</span><div className={styles.legendGrid}>{predicates.map(p=><button key={p} onClick={()=>setRelation(relation===p?'ALL':p)} className={relation===p?styles.legendActive:''}><i style={{borderTopStyle:edgeDash[p]==='0'?'solid':'dashed'}}/>{p.replaceAll('_',' ')}</button>)}</div></div>
   <div className={styles.methodCard}><span className="eyebrow">{t.method}</span><p>{t.methodText}</p></div>
  </section>

  <section className={styles.accessibleList} aria-label={locale==='es'?'Lista accesible de relaciones':'Accessible relationship list'}><h2>{locale==='es'?'Relaciones documentadas':'Documented relationships'}</h2>{edges.map(e=><button key={e.id} onClick={()=>setSelection({kind:'edge',edge:e})}><span>{institutionalNodes.find(n=>n.id===e.source)?.label}</span><b>{e.predicate.replaceAll('_',' ')}</b><span>{institutionalNodes.find(n=>n.id===e.target)?.label}</span></button>)}</section>
 </main>;
}
