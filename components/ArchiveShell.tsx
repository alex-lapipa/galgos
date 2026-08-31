import {Suspense} from 'react';
import {ResearchSession} from '@/components/ResearchSession';
import {SurfaceNavigation} from '@/components/SurfaceNavigation';
export function ArchiveShell({children}:{children:React.ReactNode}){return <><aside className="rail"/><div className="shell"><Suspense fallback={null}><SurfaceNavigation/></Suspense><div className="surface-transition">{children}</div></div><Suspense fallback={null}><ResearchSession/></Suspense></>}
