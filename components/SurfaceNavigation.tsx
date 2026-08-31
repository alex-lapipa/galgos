'use client';

import Link from 'next/link';
import {usePathname,useSearchParams} from 'next/navigation';
import {timelineEvents} from '@/lib/timeline-data';
import {institutionalEdges,institutionalNodes} from '@/lib/institutional-map';
import styles from './SurfaceNavigation.module.css';

function localized(path:string,locale:'en'|'es'){
 if(path.startsWith('/en/'))return `/${locale}/${path.slice(4)}`;
 if(path.startsWith('/es/'))return `/${locale}/${path.slice(4)}`;
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
function selectedLabel(params:URLSearchParams,path:string){
 const q=params.get('q');if(q)return q;
 const event=params.get('event');if(event){const hit=timelineEvents.find(e=>e.id===event);return hit?`${hit.date} · ${hit.title}`:event}
 const node=params.get('node');if(node){return institutionalNodes.find(n=>n.id===node)?.label||node}
 const edge=params.get('edge');if(edge){const e=institutionalEdges.find(x=>x.id===edge);if(e){const s=institutionalNodes.find(n=>n.id===e.source)?.label||e.source;const t=institutionalNodes.find(n=>n.id===e.target)?.label||e.target;return `${s} · ${e.predicate.replaceAll('_',' ')} · ${t}`};return edge}
 if(path.startsWith('/archive/'))return decodeURIComponent(path.split('/').pop()||'').replaceAll('-',' ');
 return '';
}

export function SurfaceNavigation(){
 const pathname=usePathname();const params=useSearchParams();
 const locale:'en'|'es'=pathname.startsWith('/es/')?'es':'en';
 const selected=selectedLabel(params,pathname);
 const preserved=new URLSearchParams();for(const key of ['q','event','node','edge']){const v=params.get(key);if(v)preserved.set(key,v)}
 const suffix=preserved.size?`?${preserved.toString()}`:'';
 const askQ=params.get('q');
 const nav=[['Timeline',`/${locale}/timeline`],['Graph',`/${locale}/graph`],['Journey','/journey'],['Evidence','/evidence'],['Archive','/archive'],['Ask',`/ask${askQ?`?q=${encodeURIComponent(askQ)}`:''}`]] as const;
 return <>
  <nav className="nav" aria-label="Primary research navigation"><Link href="/">GALGO/7</Link><div className="links">{nav.map(([label,href])=><Link key={label} href={href} className={pathname===href.split('?')[0]?styles.active:''}>{label}</Link>)}</div><div className="nav-editions" aria-label="Language"><Link className={locale==='en'?styles.activeLocale:''} href={`${localized(pathname,'en')}${suffix}`}>EN</Link><span>/</span><Link className={locale==='es'?styles.activeLocale:''} href={`${localized(pathname,'es')}${suffix}`}>ES</Link></div></nav>
  <div className={styles.contextBar} aria-label="Research breadcrumb"><Link href="/">GALGO/7</Link><span>›</span><strong>{crumb(pathname)}</strong>{selected&&<><span>›</span><em title={selected}>{selected}</em></>}</div>
 </>
}
