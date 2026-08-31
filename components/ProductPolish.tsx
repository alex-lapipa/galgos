'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

const css=`
.skip-link{position:fixed;left:14px;top:10px;z-index:9999;transform:translateY(-160%);padding:10px 14px;border-radius:999px;background:var(--ice,#fff);color:var(--night,#071019);font:600 12px/1 Geist,Arial,sans-serif;text-decoration:none;box-shadow:0 8px 28px rgba(0,0,0,.28)}
.skip-link:focus{transform:none}
:where(a,button,input,select,textarea,[tabindex]):focus-visible{outline:3px solid var(--galgo-cyan,#27c7c9);outline-offset:3px;box-shadow:0 0 0 5px color-mix(in srgb,var(--galgo-cyan,#27c7c9) 18%,transparent)}
.surface-transition{min-height:50vh}
.nav a,.nav-editions a{display:inline-flex;align-items:center;min-height:40px}
@media(prefers-reduced-motion:no-preference){.surface-transition>main{animation:galgoSurfaceIn .36s cubic-bezier(.2,.75,.2,1) both}@keyframes galgoSurfaceIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;transition-delay:0s!important;scroll-behavior:auto!important}.timeline-galgo{animation:none!important}.runner{display:none!important}}
@media(max-width:760px){.nav{gap:10px}.nav .links{overflow-x:auto;scrollbar-width:none;max-width:72vw}.nav .links::-webkit-scrollbar{display:none}.nav .links a{display:inline-flex!important;white-space:nowrap;min-height:42px}.nav-editions a{min-width:32px;justify-content:center}.surface-transition{min-width:0}}
`;

export function ProductPolish(){
 const pathname=usePathname();
 useEffect(()=>{const main=document.querySelector('main');if(main&&!main.id)main.id='research-main'},[pathname]);
 return <><a className="skip-link" href="#research-main">Skip to research content</a><style dangerouslySetInnerHTML={{__html:css}}/></>;
}
