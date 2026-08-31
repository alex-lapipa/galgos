'use client';

import {useEffect,useRef} from 'react';
import {usePathname,useRouter,useSearchParams} from 'next/navigation';
import {timelineEvents} from '@/lib/timeline-data';
import {institutionalEdges,institutionalNodes} from '@/lib/institutional-map';
import {emitResearchContext} from '@/lib/research-context';

type Props={surface:'timeline'|'graph';locale:'en'|'es'};

function withOnly(path:string,key:string,value:string){const p=new URLSearchParams();p.set(key,value);return `${path}?${p.toString()}`}

export function SelectionDeepLinkBridge({surface,locale}:Props){
 const pathname=usePathname();const params=useSearchParams();const router=useRouter();const restored=useRef('');
 useEffect(()=>{
   const wanted=surface==='timeline'?params.get('event'):(params.get('node')||params.get('edge'));
   if(!wanted||restored.current===`${surface}:${wanted}`)return;
   let cancelled=false;let attempts=0;
   const restore=()=>{
     if(cancelled||attempts++>25)return;
     if(surface==='timeline'){
       const id=params.get('event');const index=timelineEvents.findIndex(e=>e.id===id);
       const buttons=[...document.querySelectorAll<HTMLButtonElement>('button.timeline-node')];
       if(index>=0&&buttons[index]){restored.current=`timeline:${id}`;buttons[index].click();return;}
     }else{
       const nodeId=params.get('node');const edgeId=params.get('edge');
       if(nodeId){const n=institutionalNodes.find(x=>x.id===nodeId);if(n){const button=[...document.querySelectorAll<HTMLButtonElement>('button')].find(b=>!!b.querySelector('small')&&[...b.querySelectorAll('span')].some(s=>s.textContent?.trim()===n.label));if(button){restored.current=`graph:${nodeId}`;button.click();return;}}}
       if(edgeId){const e=institutionalEdges.find(x=>x.id===edgeId);if(e){const s=institutionalNodes.find(n=>n.id===e.source)?.label;const t=institutionalNodes.find(n=>n.id===e.target)?.label;const aria=`${s} ${e.predicate} ${t}`;const button=[...document.querySelectorAll<HTMLButtonElement>('button[aria-label]')].find(b=>b.getAttribute('aria-label')===aria);if(button){restored.current=`graph:${edgeId}`;button.click();return;}}}
     }
     window.setTimeout(restore,80);
   };
   restore();return()=>{cancelled=true};
 },[surface,params]);
 useEffect(()=>{
   const capture=(event:MouseEvent)=>{
     const button=(event.target as HTMLElement)?.closest('button');if(!button)return;
     if(surface==='timeline'){
       if(button.classList.contains('timeline-node')){const buttons=[...document.querySelectorAll<HTMLButtonElement>('button.timeline-node')];const index=buttons.indexOf(button);const item=timelineEvents[index];if(item){const href=withOnly(pathname,'event',item.id);router.replace(href,{scroll:false});emitResearchContext({surface:'timeline',kind:'event',label:item.title,href,detail:`${item.date} · ${item.evidence}`});}}
       const aria=button.getAttribute('aria-label')?.toLowerCase()||'';const text=button.textContent?.trim().toLowerCase()||'';if(aria==='close'||aria==='cerrar'||text==='×'){if(params.get('event'))router.replace(pathname,{scroll:false});}
     }else{
       const aria=button.getAttribute('aria-label');if(aria){const edge=institutionalEdges.find(e=>{const s=institutionalNodes.find(n=>n.id===e.source)?.label;const t=institutionalNodes.find(n=>n.id===e.target)?.label;return `${s} ${e.predicate} ${t}`===aria});if(edge){const href=withOnly(pathname,'edge',edge.id);router.replace(href,{scroll:false});emitResearchContext({surface:'graph',kind:'relationship',label:aria,href});return;}}
       if(button.querySelector('small')){const node=institutionalNodes.find(n=>[...button.querySelectorAll('span')].some(s=>s.textContent?.trim()===n.label));if(node){const href=withOnly(pathname,'node',node.id);router.replace(href,{scroll:false});emitResearchContext({surface:'graph',kind:'institution',label:node.label,href});return;}}
       const text=button.textContent?.trim();if(text==='×'&&(params.get('node')||params.get('edge')))router.replace(pathname,{scroll:false});
     }
   };
   window.addEventListener('click',capture,true);return()=>window.removeEventListener('click',capture,true);
 },[surface,locale,pathname,params,router]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key!=='Escape')return;if(surface==='timeline'&&params.get('event'))router.replace(pathname,{scroll:false});if(surface==='graph'&&(params.get('node')||params.get('edge')))router.replace(pathname,{scroll:false});};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[surface,pathname,params,router]);
 return null;
}
