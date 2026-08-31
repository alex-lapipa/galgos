import {Suspense} from 'react';
import {TimelineExperience} from '@/components/TimelineExperience';
import {SelectionDeepLinkBridge} from '@/components/SelectionDeepLinkBridge';
export default function EnglishTimeline(){return <><Suspense fallback={null}><SelectionDeepLinkBridge surface="timeline" locale="en"/></Suspense><TimelineExperience locale="en"/></>}
