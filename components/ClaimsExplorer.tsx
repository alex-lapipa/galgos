'use client';

import Link from 'next/link';
import {useMemo,useState} from 'react';
import type {ClaimRecord,ContinuityDimension,EvidenceLevel} from '@/lib/claims';
import styles from './ClaimsExplorer.module.css';

const all='all';
const evidenceOrder:EvidenceLevel[]=['confirmed','probable','plausible','disputed','traditional claim','unsupported','disproven or materially misleading'];
const dimensions:ContinuityDimension[]=['function','type','population','name','formal breed','cross-cutting'];

function sourceHref(source:string){return `/archive/${encodeURIComponent(source.replace(/\.md$/,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''))}`}

export function ClaimsExplorer({claims}:{claims:ClaimRecord[]}){
 const [query,setQuery]=useState('');const [evidence,setEvidence]=useState(all);const [dimension,setDimension]=useState(all);
 const filtered=useMemo(()=>claims.filter(claim=>{
  const hay=`${claim.claimId} ${claim.statement} ${claim.note} ${claim.reviewStatus}`.toLowerCase();
  return (!query||hay.includes(query.toLowerCase()))&&(evidence===all||claim.evidenceLevel===evidence)&&(dimension===all||claim.dimension===dimension);
 }),[claims,query,evidence,dimension]);
 const counts=useMemo(()=>new Map(evidenceOrder.map(level=>[level,claims.filter(c=>c.evidenceLevel===level).length])),[claims]);
 return <main className={styles.page}><div className={styles.inner}>
  <section className={styles.hero}><span className="eyebrow">Auditable claim ledger</span><h1>Claims, not legends.</h1><p>Every recurring assertion is treated as a research object with exact wording, evidence classification, continuity dimension, source relationships and review status.</p><div className={styles.rule}><strong>Rule:</strong> a claim can be strong on function or naming and still remain unsupported on population continuity. GALGOS never collapses those dimensions into a single ancestry score.</div></section>
  <section className={styles.summary} aria-label="Evidence classification summary">{evidenceOrder.map(level=><button key={level} onClick={()=>setEvidence(evidence===level?all:level)} className={evidence===level?styles.selected:''}><b>{counts.get(level)||0}</b><span>{level}</span></button>)}</section>
  <section className={styles.controls}><label><span>Search claims</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="vertragus, Greyhound, fueros…"/></label><label><span>Evidence</span><select value={evidence} onChange={e=>setEvidence(e.target.value)}><option value={all}>All evidence levels</option>{evidenceOrder.map(level=><option key={level} value={level}>{level}</option>)}</select></label><label><span>Continuity</span><select value={dimension} onChange={e=>setDimension(e.target.value)}><option value={all}>All dimensions</option>{dimensions.map(d=><option key={d} value={d}>{d}</option>)}</select></label><div className={styles.resultCount}>{filtered.length} / {claims.length} claims</div></section>
  <section className={styles.ledger}>{filtered.map(claim=><article key={claim.claimId} className={styles.claim}><div className={styles.claimHead}><span>{claim.claimId}</span><div><b className={styles.evidence}>{claim.evidenceLevel}</b><b className={styles.dimension}>{claim.dimension}</b></div></div><h2>{claim.statement}</h2><p className={styles.note}>{claim.note}</p><dl><div><dt>Review status</dt><dd>{claim.reviewStatus.replaceAll('_',' ')}</dd></div><div><dt>Supporting / contextual sources</dt><dd>{claim.supportingSources.length?claim.supportingSources.map(source=><Link key={source} href={sourceHref(source)}>{source}</Link>):<span>None recorded</span>}</dd></div><div><dt>Contradicting / limiting sources</dt><dd>{claim.limitingSources.length?claim.limitingSources.map(source=><Link key={source} href={sourceHref(source)}>{source}</Link>):<span>None recorded</span>}</dd></div></dl><div className={styles.actions}><Link href={`/ask?q=${encodeURIComponent(`Evaluate this claim from the archive: ${claim.statement}`)}`}>Ask Archive about this claim →</Link><Link href="/archive/galgo-espanol-claim-ledger">Open canonical ledger →</Link></div></article>)}</section>
  {!filtered.length&&<div className={styles.empty}>No claims match these filters.</div>}
 </div></main>
}
