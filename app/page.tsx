import Link from 'next/link';
import {GalgoSilhouette} from '@/components/GalgoSilhouette';
import {timelineEvents,eras} from '@/lib/timeline-data';
import styles from './Home.module.css';

export const metadata={title:'GALGOS — Historia y cultura del Galgo Español',description:'Un centro de conocimiento abierto para descubrir la historia, la cultura y las fuentes del Galgo Español.'};

export default function Home(){
 const paths=[
  {n:'01',title:'Recorre su historia',body:'Desde los primeros perros documentados en la Península hasta el galgo de hoy. Fechas, relatos, dudas y descubrimientos explicados con claridad.',href:'/es/timeline',action:'Abrir la historia',glow:'rgba(39,199,201,.8)'},
  {n:'02',title:'Descubre su cultura',body:'Arte, literatura, caza, leyes, vida rural y memoria social: las muchas formas en que el galgo aparece en la historia de España.',href:'/culture',action:'Explorar cultura',glow:'rgba(232,195,72,.8)'},
  {n:'03',title:'Pregunta lo que quieras',body:'Haz una pregunta en lenguaje normal. GALGOS busca en sus fuentes y te muestra de dónde sale la respuesta.',href:'/ask?lang=es',action:'Hacer una pregunta',glow:'rgba(88,112,255,.85)'},
 ];
 return <main className={styles.page}>
  <section className={styles.hero}><div><span className="eyebrow">Historia · cultura · memoria del Galgo Español</span><h1>GALGO<br/>/7</h1><p>Un lugar para conocer al Galgo Español sin necesidad de ser especialista. Recorre su historia, descubre cómo ha cambiado su papel en la sociedad y consulta las fuentes detrás de cada relato.</p><div className={styles.promise}><span>acceso libre</span><span>fuentes visibles</span><span>español primero</span><span>sin mitos disfrazados de hechos</span></div></div><div className={styles.heroDog}><GalgoSilhouette/></div></section>
  <section className={styles.paths}><div className={styles.sectionHead}><span className="eyebrow">Empieza por aquí</span><h2>Una historia enorme, contada de forma sencilla.</h2><p>No hace falta entender archivos, bases de datos ni métodos de investigación. Elige una ruta y sigue explorando a tu ritmo.</p></div><div className={styles.pathGrid}>{paths.map(path=><Link key={path.n} className={styles.path} href={path.href} style={{'--path-glow':path.glow} as React.CSSProperties}><span className={styles.pathNo}>{path.n}</span><h3>{path.title}</h3><p>{path.body}</p><strong>{path.action} →</strong></Link>)}</div></section>
  <section className={styles.stats} aria-label="Contenido disponible"><div className={styles.stat}><b>{timelineEvents.length}</b><span>momentos de la historia</span></div><div className={styles.stat}><b>{eras.length}</b><span>grandes épocas</span></div><div className={styles.stat}><b>5</b><span>formas de entender la continuidad</span></div><div className={styles.stat}><b>1</b><span>historia que sigue abierta</span></div></section>
  <section className={styles.principle}><div><span className="eyebrow">Una idea importante</span><h2>Que dos perros se parezcan no significa que sean la misma raza.</h2></div><div className={styles.principleText}>{[['01','Uso','¿Se utilizaban para correr, cazar o acompañar de forma parecida?'],['02','Aspecto','¿Aparece una forma corporal reconocible en textos, imágenes o restos?'],['03','Familias de perros','¿Podemos conectar poblaciones de perros a través del tiempo?'],['04','Nombre','¿Cuándo aparece la palabra galgo y qué significaba en cada época?'],['05','Raza moderna','¿Cuándo aparecen el estándar, los registros y las instituciones actuales?']].map(([n,title,body])=><article key={n}><b>{n}</b><div><strong>{title}</strong><p>{body}</p></div></article>)}</div></section>
  <section className={styles.open}><div><span className="eyebrow">¿Quieres ver las fuentes?</span><h2>La biblioteca está abierta.</h2><p>Consulta documentos históricos, estudios, obras de arte y registros institucionales. Los presentamos como lecturas, no como archivos técnicos.</p></div><Link href="/archive">Entrar en la biblioteca →</Link></section>
 </main>;
}
