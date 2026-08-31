import {goldCases} from '../eval/gold-questions';

const base=(process.env.GALGOS_BASE_URL||'').replace(/\/$/,'');
if(!base)throw new Error('GALGOS_BASE_URL is required, e.g. https://galgos.alexlawton.ai');

type SearchResult={repository_path:string;sourceRole?:string;heading_path?:string;score?:number};

async function main(){
 let hits=0;let totalDistinctDocs=0;let totalRoleDiversity=0;let worstConcentration=0;let httpFailures=0;
 const categories=new Map<string,{total:number;hits:number}>();
 for(const test of goldCases){
  const response=await fetch(`${base}/api/search`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query:test.question,limit:10})});
  if(!response.ok){httpFailures++;console.log(JSON.stringify({id:test.id,ok:false,http:response.status,question:test.question}));continue}
  const payload=await response.json() as {results?:SearchResult[]};const results=payload.results||[];const paths=results.map(r=>String(r.repository_path||'').toLowerCase());
  const ok=test.expectedPathNeedles.some(needle=>paths.some(path=>path.includes(needle.toLowerCase())));if(ok)hits++;
  const category=categories.get(test.category)??{total:0,hits:0};category.total++;if(ok)category.hits++;categories.set(test.category,category);
  const distinctDocs=new Set(paths);totalDistinctDocs+=distinctDocs.size;const roles=new Set(results.map(r=>r.sourceRole||'unknown'));totalRoleDiversity+=roles.size;
  const concentration=results.length?Math.max(...[...distinctDocs].map(path=>paths.filter(p=>p===path).length/results.length)):0;worstConcentration=Math.max(worstConcentration,concentration);
  console.log(JSON.stringify({id:test.id,locale:test.locale,category:test.category,ok,http:response.status,question:test.question,expected:test.expectedPathNeedles,distinctDocuments:distinctDocs.size,sourceRoles:[...roles],concentration:Number(concentration.toFixed(2)),top:results.slice(0,5).map(r=>({path:r.repository_path,heading:r.heading_path,sourceRole:r.sourceRole,score:r.score}))}));
 }
 const evaluated=goldCases.length-httpFailures;const recall=evaluated?hits/evaluated:0;const avgDistinctDocs=evaluated?totalDistinctDocs/evaluated:0;const avgRoleDiversity=evaluated?totalRoleDiversity/evaluated:0;
 const categoryRecall=[...categories].map(([category,v])=>({category,recall:Number((v.hits/v.total).toFixed(3)),hits:v.hits,total:v.total}));
 const summary={cases:goldCases.length,evaluated,httpFailures,hits,recall:Number(recall.toFixed(3)),avgDistinctDocuments:Number(avgDistinctDocs.toFixed(2)),avgSourceRoleDiversity:Number(avgRoleDiversity.toFixed(2)),worstSingleDocumentConcentration:Number(worstConcentration.toFixed(2)),categoryRecall};
 console.log(JSON.stringify({goldHttpSummary:summary},null,2));
 if(httpFailures>0||recall<0.85||avgDistinctDocs<3||worstConcentration>0.5)process.exitCode=1;
}
main().catch(error=>{console.error('[gold http retrieval eval]',error);process.exitCode=1});
