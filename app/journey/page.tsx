import Link from 'next/link';
import {chapters} from '@/lib/content';
import styles from './Journey.module.css';

const questions=[
 'What can prehistoric dogs tell us—and where does resemblance stop being evidence?',
 'Which classical texts actually describe coursing dogs, and what do they not say about Spain?',
 'When does the word galgo become legally and socially visible in medieval Iberia?',
 'How do hunting, court culture, art and literature change what the galgo means?',
 'When does a working type become a formally governed modern breed?',
 'How do law, welfare, sport, genetics and rescue describe the same dog differently today?',
 'What might a better evidence-led future for galgo heritage, care and culture look like?',
];
const glows=['rgba(255,95,75,.8)','rgba(255,150,64,.8)','rgba(232,195,72,.8)','rgba(84,190,136,.8)','rgba(39,199,201,.8)','rgba(88,112,255,.85)','rgba(174,97,255,.8)'];
export const metadata={title:'The Journey — GALGO/7',description:'A guided seven-chapter route through the history, evidence and culture of the Galgo Español.'};

export default function Journey(){return <main className={styles.page}>
 <section className={styles.hero}><span className="eyebrow">Guided historical route</span><h1>The journey</h1><p>Seven chapters take you from deep dog history to the Galgo Español of today. This is the readable route through the project; every chapter remains connected to the Timeline, Archive, Claims and Ask surfaces when you want to inspect the evidence underneath.</p><div className={styles.intro}><strong>How to read it:</strong> chapters organize the story. They do not create continuity. Function, morphological type, population, name and formal breed remain separate evidence questions throughout.</div></section>
 <section className={styles.chapters}>{chapters.map(([slug,num,title,summary],i)=><Link key={slug} href={`/era/${slug}`} className={styles.chapter} style={{'--chapter-glow':glows[i]} as React.CSSProperties}><span className={styles.number}>{num}</span><div><h2>{title}</h2><p>{summary}</p></div><div className={styles.question}><span>Question carried into this chapter</span><strong>{questions[i]}</strong><i>Read chapter →</i></div></Link>)}</section>
 <section className={styles.tools}><span className="eyebrow">Leave the guided route whenever you want</span><h2>Use the research surfaces directly.</h2><div className={styles.toolGrid}><Link href="/en/timeline" className={styles.tool}><b>Timeline</b><h3>See every event in context.</h3><p>98 evidence-classified events across ten eras, with dedicated mobile and desktop interaction modes.</p></Link><Link href="/evidence" className={styles.tool}><b>Evidence</b><h3>Compare the five continuities.</h3><p>Inspect how function, type, population, name and formal breed differ across the surviving record.</p></Link><Link href="/ask" className={styles.tool}><b>Ask Archive</b><h3>Interrogate the corpus.</h3><p>Ask a question, inspect retrieved passages and follow citations back into the Archive.</p></Link></div></section>
 </main>}
