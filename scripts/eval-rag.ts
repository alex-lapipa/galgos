import { retrieve } from '../lib/rag';

const cases=[
 ['What does Martial say about the vertragus?',['martial']],
 ['What evidence connects Roman-era coursing dogs with Hispania?',['roman-iberian']],
 ['What is the Codex Romanicus and does it exist?',['codex-romanicus']],
 ['What does Arrian say about Celtic coursing dogs?',['arrian']],
 ['How should claims of direct ancestry from the vertragus to the Galgo Español be treated?',['research_ledger','claim-classification']],
 ['¿Qué dice Marcial sobre el vertragus?',['martial']],
 ['¿Existió realmente el Codex Romanicus?',['codex-romanicus']],
 ['¿Qué cautelas metodológicas hay que aplicar a una supuesta ascendencia directa del galgo desde perros antiguos?',['research_ledger','claim-classification','batch_11_','batch_14_']]
] as const;

async function main(){
  let hits=0;
  for(const [q,needles] of cases){
    const r=await retrieve(q,8);
    const paths=r.map(x=>x.repository_path.toLowerCase());
    const ok=needles.some(n=>paths.some(p=>p.includes(n)));
    if(ok)hits++;
    console.log(JSON.stringify({q,ok,top:r.slice(0,5).map(x=>({path:x.repository_path,heading:x.heading_path,score:x.score}))}));
  }
  const recall=hits/cases.length;
  console.log(JSON.stringify({cases:cases.length,hits,recall}));
  if(hits<7)process.exitCode=1;
}

main().catch(error=>{console.error(error);process.exitCode=1});
