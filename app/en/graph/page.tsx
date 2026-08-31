import {Suspense} from 'react';
import {InstitutionalExplorerLive} from '@/components/InstitutionalExplorerLive';
import {SelectionDeepLinkBridge} from '@/components/SelectionDeepLinkBridge';
export const metadata={title:'Institutional Landscape — GALGO/7',description:'Evidence-led institutional map of the Galgo Español.'};
export default function InstitutionalGraphEnglish(){return <><Suspense fallback={null}><SelectionDeepLinkBridge surface="graph" locale="en"/></Suspense><InstitutionalExplorerLive locale="en"/></>}
