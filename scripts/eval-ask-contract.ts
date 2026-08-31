import {goldCases} from '../eval/gold-questions';

const base=(process.env.GALGOS_BASE_URL||'').replace(/\/$/,'');
if(!base)throw new Error('GALGOS_BASE_URL is required, e.g. https://galgos.alexlawton.ai');

async function main(){
 const sample=goldCases.filter((_,i)=>i%4===0).slice(0,12);let passed=0;
 for(const test of sample){
  const response=await fetch(`${base}/api/ask`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:test.question,locale:test.locale})});
  if(!response.ok){console.log(JSON.stringify({id:test.id,ok:false,http:response.status}));continue}
  const data=await response.json() as any;
  const ids=new Set((data.citations||[]).map((c:any)=>Number(c.id)));
  const used=Array.isArray(data.usedCitationIds)?data.usedCitationIds.map(Number):[];
  const idsValid=used.every((id:number)=>ids.has(id));
  const markers=[...String(data.answer||'').matchAll(/\[(\d+)\]/g)].map(m=>Number(m[1]));
  const markersValid=markers.every(id=>ids.has(id));
  const compliance=data.citationCompliance;const coverage=Number(compliance?.coverage??0);
  const statusParagraph=test.locale==='es'?/Estado de la evidencia:/i.test(String(data.answer||'')):/Evidence status:/i.test(String(data.answer||''));
  const citationsInspectable=(data.citations||[]).every((c:any)=>Number.isFinite(Number(c.id))&&typeof c.path==='string'&&Array.isArray(c.lines)&&c.lines.length===2&&typeof c.excerpt==='string'&&typeof c.sourceRole==='string');
  const ok=idsValid&&markersValid&&coverage>=0.75&&statusParagraph&&citationsInspectable;
  if(ok)passed++;
  console.log(JSON.stringify({id:test.id,ok,http:response.status,coverage,idsValid,markersValid,statusParagraph,citationsInspectable,retrieved:data.retrieved,citations:(data.citations||[]).length}));
 }
 const passRate=passed/sample.length;console.log(JSON.stringify({askContractSummary:{cases:sample.length,passed,passRate:Number(passRate.toFixed(3)),minimumCoverage:0.75}},null,2));
 if(passRate<0.9)process.exitCode=1;
}
main().catch(error=>{console.error('[ask contract eval]',error);process.exitCode=1});
