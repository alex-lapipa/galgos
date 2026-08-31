'use client';
import Link from 'next/link';
import {usePathname,useSearchParams} from 'next/navigation';
import styles from './SurfaceNavigation.module.css';

function localeFor(path:string,params:{get:(key:string)=>string|null}){if(path.startsWith('/en/'))return'en';if(path.startsWith('/es/'))return'es';return params.get('lang')==='en'?'en':'es'}
function languageHref(path:string,locale:'es'|'en'){
 if(path.includes('/timeline'))return `/${locale}/timeline`;
 if(path==='/ask'||path.startsWith('/ask?'))return `/ask?lang=${locale}`;
 if(path.includes('/graph'))return locale==='es'?'/culture':'/en/graph';
 return locale==='es'?path:`/en/timeline`;
}
export function SurfaceNavigation(){
 const pathname=usePathname();const params=useSearchParams();const locale=localeFor(pathname,params);
 const es=[['Historia','/es/timeline'],['Cultura','/culture'],['Biblioteca','/archive'],['Pregunta','/ask?lang=es']] as const;
 const en=[['History','/en/timeline'],['Culture','/culture?lang=en'],['Library','/archive?lang=en'],['Ask','/ask?lang=en']] as const;
 const nav=locale==='es'?es:en;
 return <nav className="nav" aria-label={locale==='es'?'Navegación principal':'Main navigation'}><Link href="/">GALGO/7</Link><div className="links">{nav.map(([label,href])=><Link key={label} href={href} className={pathname===href.split('?')[0]?styles.active:''}>{label}</Link>)}</div><div className="nav-editions" aria-label="Idioma"><Link className={locale==='es'?styles.activeLocale:''} href={languageHref(pathname,'es')}>ES</Link><span>/</span><Link className={locale==='en'?styles.activeLocale:''} href={languageHref(pathname,'en')}>EN</Link></div></nav>;
}
