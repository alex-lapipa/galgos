import './globals.css';import {ArchiveShell} from '@/components/ArchiveShell';
export const metadata={title:'GALGOS — Galgo Español',description:'Historia, cultura y fuentes del Galgo Español.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body><ArchiveShell>{children}</ArchiveShell></body></html>}
