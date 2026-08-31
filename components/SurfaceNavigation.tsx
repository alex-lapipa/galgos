'use client';

import Link from 'next/link';
import {usePathname,useSearchParams} from 'next/navigation';
import styles from './SurfaceNavigation.module.css';

function localized(path:string,locale:'en'|'es'){
 if(path.startsWith('/en/'))return `/${locale}/${path.slice(4)}`;
 if(path.startsWith('/es/'))return `/${locale}/${path.slice(4)}`;
 if(path==='/ask'||path.startsWith('/ask?'))return path;
 return path;
}
function crumb(path:string){
 if(path.includes('/timeline'))return 'Timeline';
 if(path.includes('/graph'))return 'Institutional Graph';
 if(path.startsWith('/archive/'))return 'Archive / Record';
 if(path.startsWith('/archive'))return 'Archive';
 if(path.startsWith('/ask'))return 'Ask Archive';
 if(path.startsWith('/journey'))return 'Journey';
 if(path.startsWith('/evidence'))return 'Evidence';
 return 'Home';
}

export function SurfaceNavigation(){
 const pathname=usePathname();const params=useSearchParams();
 const locale: 'en'|'es'=pathname.startsWith('/es/')?'es':'en';
 const q=params.get('q');
 const suffix=q?`?q=${encodeURIComponent(q)}`:'';
 const nav=[['Timeline',`/${locale}/timeline`],['Graph',`/${locale}/graph`],['Journey','/journey'],['Evidence','/evidence'],['Archive','/archive'],['Ask',`/ask${suffix}`]] as const;
 return <>
  <nav className="nav"><Link href="/">GALGO/7</Link><div className="links">{nav.map(([label,href])=><Link key={label} href={href} className={pathname===href.split('?')[0]?styles.active:''}>{label}</Link>)}</div><div className="nav-editions"><Link className={locale==='en'?styles.activeLocale:''} href={`${localized(pathname,'en')}${suffix}`}>EN</Link><span>/</span><Link className={locale==='es'?styles.activeLocale:''} href={`${localized(pathname,'es')}${suffix}`}>ES</Link></div></nav>
  <div className={styles.contextBar}><Link href="/">GALGO/7</Link><span>›</span><strong>{crumb(pathname)}</strong>{q&&<><span>›</span><em>{q}</em></>}</div>
 </>
}
