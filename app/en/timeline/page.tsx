import {Suspense} from 'react';
import {TimelineExperience} from '@/components/TimelineExperience';
import {MobileTimeline} from '@/components/MobileTimeline';
import {SelectionDeepLinkBridge} from '@/components/SelectionDeepLinkBridge';
export default function EnglishTimeline(){return <><Suspense fallback={null}><SelectionDeepLinkBridge surface="timeline" locale="en"/><MobileTimeline locale="en"/></Suspense><TimelineExperience locale="en"/></>}
