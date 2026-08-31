import {ClaimsExplorer} from '@/components/ClaimsExplorer';
import {listClaims} from '@/lib/claims';
import {listCorpus} from '@/lib/corpus';

export const metadata={title:'Claims — GALGO/7',description:'Auditable evidence-classified claims about the history of the Galgo Español.'};

export default async function Claims(){
 const [claims,corpus]=await Promise.all([listClaims(),listCorpus()]);
 const sourceLinks=Object.fromEntries(corpus.map(doc=>[doc.path,`/archive/${doc.slug}`]));
 return <ClaimsExplorer claims={claims} sourceLinks={sourceLinks}/>;
}
