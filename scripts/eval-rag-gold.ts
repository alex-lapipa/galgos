import {goldCases} from '../eval/gold-questions';
import {retrieve} from '../lib/rag';
import {listCorpus} from '../lib/corpus';

async function main(){
 const corpus=await listCorpus();
 const byPath=new Map(corpus.map(doc=>[doc.path.toLowerCase(),doc]));
 let hits=0;let totalDistinctDocs=0;let totalRoleDiversity=0;let worstConcentration=0;
 const categories=new Map<string,{total:number;hits:number}>();
 for(const test of goldCases){
  const results=await retrieve(test.question,10);
  const paths=results.map(r=>r.repository_path.toLowerCase());
  const ok=test.expectedPathNeedles.some(needle=>paths.some(path=>path.includes(needle.toLowerCase())));
  if(ok)hits++;
  const category=categories.get(test.category)??{total:0,hits:0};category.total++;if(ok)category.hits++;categories.set(test.category,category);
  const distinctDocs=new Set(paths);totalDistinctDocs+=distinctDocs.size;
  const roles=new Set(paths.map(path=>byPath.get(path)?.sourceRole??'unknown'));totalRoleDiversity+=roles.size;
  const concentration=Math.max(0,...[...distinctDocs].map(path=>paths.filter(p=>p===path).length/results.length));worstConcentration=Math.max(worstConcentration,concentration);
  console.log(JSON.stringify({id:test.id,locale:test.locale,category:test.category,ok,question:test.question,expected:test.expectedPathNeedles,distinctDocuments:distinctDocs.size,sourceRoles:[...roles],top:results.slice(0,5).map(r=>({path:r.repository_path,heading:r.heading_path,score:r.score}))}));
 }
 const recall=hits/goldCases.length;const avgDistinctDocs=totalDistinctDocs/goldCases.length;const avgRoleDiversity=totalRoleDiversity/goldCases.length;
 const categoryRecall=[...categories].map(([category,v])=>({category,recall:v.hits/v.total,hits:v.hits,total:v.total}));
 const summary={cases:goldCases.length,hits,recall:Number(recall.toFixed(3)),avgDistinctDocuments:Number(avgDistinctDocs.toFixed(2)),avgSourceRoleDiversity:Number(avgRoleDiversity.toFixed(2)),worstSingleDocumentConcentration:Number(worstConcentration.toFixed(2)),categoryRecall};
 console.log(JSON.stringify({goldSummary:summary},null,2));
 if(recall<0.85||avgDistinctDocs<3||worstConcentration>0.5)process.exitCode=1;
}
main().catch(error=>{console.error('[gold retrieval eval]',error);process.exitCode=1});
