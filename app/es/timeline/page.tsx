import {Suspense} from 'react';
import {TimelineExperience} from '@/components/TimelineExperience';
import {SelectionDeepLinkBridge} from '@/components/SelectionDeepLinkBridge';
export default function SpanishTimeline(){return <><Suspense fallback={null}><SelectionDeepLinkBridge surface="timeline" locale="es"/></Suspense><TimelineExperience locale="es"/></>}
