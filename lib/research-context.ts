export type ResearchSurface='timeline'|'graph'|'archive'|'ask'|'journey'|'evidence'|'other';
export type ResearchContextItem={id:string;surface:ResearchSurface;kind:string;label:string;href:string;detail?:string;at:number};
export const RESEARCH_CONTEXT_EVENT='galgo:research-context';
export function emitResearchContext(item:Omit<ResearchContextItem,'id'|'at'>){
 if(typeof window==='undefined')return;
 window.dispatchEvent(new CustomEvent(RESEARCH_CONTEXT_EVENT,{detail:{...item,id:`${item.surface}:${item.kind}:${item.href}:${item.label}`,at:Date.now()}}));
}
