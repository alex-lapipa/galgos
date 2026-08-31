import {InstitutionalExplorerLive} from '@/components/InstitutionalExplorerLive';
import {SelectionDeepLinkBridge} from '@/components/SelectionDeepLinkBridge';
export const metadata={title:'Institutional Landscape — GALGO/7',description:'Evidence-led institutional map of the Galgo Español.'};
export default function InstitutionalGraphEnglish(){return <><SelectionDeepLinkBridge surface="graph" locale="en"/><InstitutionalExplorerLive locale="en"/></>}
