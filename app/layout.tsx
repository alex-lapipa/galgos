import './globals.css';import {ArchiveShell} from '@/components/ArchiveShell';
export const metadata={title:'GALGO/7 — Archive to Cosmos',description:'An evidence-led archive of the Galgo Español.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><ArchiveShell>{children}</ArchiveShell></body></html>}
