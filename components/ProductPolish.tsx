'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

const css=`
.skip-link{position:fixed;left:14px;top:10px;z-index:9999;transform:translateY(-160%);padding:10px 14px;border-radius:999px;background:var(--ice,#fff);color:var(--night,#071019);font:600 12px/1 Geist,Arial,sans-serif;text-decoration:none;box-shadow:0 8px 28px rgba(0,0,0,.28)}
.skip-link:focus{transform:none}
:where(a,button,input,select,textarea,[tabindex]):focus-visible{outline:3px solid var(--galgo-cyan,#27c7c9);outline-offset:3px;box-shadow:0 0 0 5px color-mix(in srgb,var(--galgo-cyan,#27c7c9) 18%,transparent)}
.surface-transition{min-height:50vh;min-width:0}.nav a,.nav-editions a{display:inline-flex;align-items:center;min-height:40px}
@media(prefers-reduced-motion:no-preference){.surface-transition>main{animation:galgoSurfaceIn .36s cubic-bezier(.2,.75,.2,1) both}@keyframes galgoSurfaceIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;transition-delay:0s!important;scroll-behavior:auto!important}.timeline-galgo{animation:none!important}.runner{display:none!important}}
@media(min-width:761px) and (max-height:950px){.timeline-hero{padding-bottom:140px!important}}
@media(max-width:760px){body{padding-bottom:env(safe-area-inset-bottom)}.shell{padding-left:14px!important;padding-right:14px!important}.nav{height:58px;gap:8px;position:sticky;top:0;z-index:45;background:color-mix(in srgb,var(--paper) 90%,transparent);backdrop-filter:blur(18px);margin-left:-14px;margin-right:-14px;padding:0 14px;border-bottom:1px solid color-mix(in srgb,var(--ink) 12%,transparent)}.nav>a:first-child{font-weight:700;flex:none}.nav .links{display:flex;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-width:none;max-width:none;flex:1;gap:4px}.nav .links::-webkit-scrollbar{display:none}.nav .links a{display:inline-flex!important;white-space:nowrap;min-height:42px;padding:0 8px;scroll-snap-align:start}.nav-editions{display:flex;align-items:center;flex:none}.nav-editions a{min-width:30px;justify-content:center}.surface-transition{min-width:0}}
@media(max-width:430px){.nav{font-size:10px;letter-spacing:.055em}.nav .links a{padding-inline:7px}.nav>a:first-child{font-size:10px}.hero-actions .glass-button{min-height:42px}.timeline-page{padding-left:14px!important;padding-right:14px!important}.timeline-controls{border-radius:18px}.glass-panel{backdrop-filter:blur(14px) saturate(120%);-webkit-backdrop-filter:blur(14px) saturate(120%)}}
@media(max-width:390px){.shell{padding-left:12px!important;padding-right:12px!important}.nav{margin-left:-12px;margin-right:-12px;padding-inline:12px}.nav-editions span{display:none}.nav-editions a{min-width:28px}.nav .links{gap:1px}}
`;

export function ProductPolish(){
 const pathname=usePathname();
 useEffect(()=>{const main=document.querySelector('main');if(main&&!main.id)main.id='research-main'},[pathname]);
 return <><a className="skip-link" href="#research-main">Skip to research content</a><style dangerouslySetInnerHTML={{__html:css}}/></>;
}
