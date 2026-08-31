import {Suspense} from 'react';
import {InstitutionalExplorerLive} from '@/components/InstitutionalExplorerLive';
import {SelectionDeepLinkBridge} from '@/components/SelectionDeepLinkBridge';
export const metadata={title:'Paisaje institucional — GALGO/7',description:'Mapa institucional del Galgo Español basado en evidencia.'};
export default function InstitutionalGraphSpanish(){return <><Suspense fallback={null}><SelectionDeepLinkBridge surface="graph" locale="es"/></Suspense><InstitutionalExplorerLive locale="es"/></>}
