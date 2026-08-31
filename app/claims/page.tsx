import {ClaimsExplorer} from '@/components/ClaimsExplorer';
import {listClaims} from '@/lib/claims';

export const metadata={title:'Claims — GALGO/7',description:'Auditable evidence-classified claims about the history of the Galgo Español.'};

export default async function Claims(){
 const claims=await listClaims();
 return <ClaimsExplorer claims={claims}/>;
}
