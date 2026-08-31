import {Suspense} from 'react';
import {ResearchSession} from '@/components/ResearchSession';
import {SurfaceNavigation} from '@/components/SurfaceNavigation';
import {ProductPolish} from '@/components/ProductPolish';
export function ArchiveShell({children}:{children:React.ReactNode}){return <><ProductPolish/><aside className="rail"/><div className="shell"><Suspense fallback={null}><SurfaceNavigation/></Suspense><div className="surface-transition">{children}</div></div><Suspense fallback={null}><ResearchSession/></Suspense></>}
