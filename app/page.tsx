import Link from 'next/link';
import {GalgoSilhouette} from '@/components/GalgoSilhouette';
import {timelineEvents,eras} from '@/lib/timeline-data';
import {listCorpus} from '@/lib/corpus';
import {listClaims} from '@/lib/claims';
import styles from './Home.module.css';

export default async function Home(){
 const [corpus,claims]=await Promise.all([listCorpus(),listClaims()]);
 const activeCorpus=corpus.length;
 const paths=[
  {n:'01',title:'Explore the history',body:'Move through almost eighteen millennia of dog history, with each event classified by evidence strength and continuity dimension.',href:'/en/timeline',action:'Open the Timeline',glow:'rgba(39,199,201,.8)'},
  {n:'02',title:'Investigate the evidence',body:'Compare function, type, population, name and formal-breed continuity without collapsing them into one ancestry story.',href:'/evidence',action:'Open the Evidence Observatory',glow:'rgba(232,195,72,.8)'},
  {n:'03',title:'Ask the archive',body:'Ask a historical, legal, cultural or institutional question and inspect the exact passages used to build the answer.',href:'/ask',action:'Open Ask Archive',glow:'rgba(88,112,255,.85)'},
 ];
 return <main className={styles.page}>
  <section className={styles.hero}><div><span className="eyebrow">Free public research platform · Galgo Español</span><h1>GALGO<br/>/7</h1><p>The history and culture of the Galgo Español, built as a navigable evidence engine: what the record supports, what remains disputed, and where the story is still open.</p><div className={styles.promise}><span>free to use</span><span>citation-first</span><span>evidence-labelled</span><span>Spanish + English research surfaces</span></div></div><div className={styles.heroDog}><GalgoSilhouette/></div></section>
  <section className={styles.paths}><div className={styles.sectionHead}><span className="eyebrow">Choose your route</span><h2>History is easier to understand when the evidence stays visible.</h2><p>GALGOS is designed for curious visitors, researchers, galgueros, rescue communities, students and anyone who wants to understand the breed without having to choose between mythology and advocacy.</p></div><div className={styles.pathGrid}>{paths.map(path=><Link key={path.n} className={styles.path} href={path.href} style={{'--path-glow':path.glow} as React.CSSProperties}><span className={styles.pathNo}>{path.n}</span><h3>{path.title}</h3><p>{path.body}</p><strong>{path.action} →</strong></Link>)}</div></section>
  <section className={styles.stats} aria-label="Current research corpus scale"><div className={styles.stat}><b>{timelineEvents.length}</b><span>evidence-classified timeline events</span></div><div className={styles.stat}><b>{eras.length}</b><span>historical eras</span></div><div className={styles.stat}><b>{activeCorpus}</b><span>research records in the corpus</span></div><div className={styles.stat}><b>{claims.length}</b><span>auditable claim records</span></div></section>
  <section className={styles.principle}><div><span className="eyebrow">The GALGOS method</span><h2>One dog. Five different continuity questions.</h2></div><div className={styles.principleText}>{[['01','Function','Was a dog used for the same kind of work?'],['02','Morphological type','Does a recognisable body plan recur in text, art or remains?'],['03','Population','Can an actual breeding population be connected across time?'],['04','Name','Does the terminology persist—and does it mean the same thing?'],['05','Formal breed','When does documented standard, registry and institutional breed identity begin?']].map(([n,title,body])=><article key={n}><b>{n}</b><div><strong>{title}</strong><p>{body}</p></div></article>)}</div></section>
  <section className={styles.open}><div><span className="eyebrow">Open research journey</span><h2>Prefer a guided story?</h2><p>The Journey turns the corpus into seven readable chapters, then hands you back to the Timeline, Archive and Ask surfaces whenever you want to inspect the underlying evidence.</p></div><Link href="/journey">Start the Journey →</Link></section>
 </main>;
}
