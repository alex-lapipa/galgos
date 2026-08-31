export type InstitutionalNode={id:string;label:string;type:string;stance?:string;properties?:Record<string,unknown>;x:number;y:number};
export type InstitutionalEdge={id:string;source:string;target:string;predicate:string;confidence:number;repositoryPath:string};

export const institutionalNodes:InstitutionalNode[]=[
{id:'sos-galgos',label:'SOS Galgos',type:'RESCUE_SHELTER',stance:'ANTI_HUNTING',x:16,y:28},
{id:'scooby',label:'Protectora y Santuario Scooby',type:'RESCUE_SHELTER',stance:'ANTI_HUNTING',x:13,y:44},
{id:'fbm',label:'Fundación Benjamín Mehnert',type:'RESCUE_SHELTER',stance:'WELFARE_NEUTRAL',x:21,y:58},
{id:'gds',label:'Galgos del Sol',type:'RESCUE_SHELTER',stance:'WELFARE_NEUTRAL',x:30,y:68},
{id:'gdsur',label:'Galgos del Sur',type:'RESCUE_SHELTER',stance:'ANTI_HUNTING',x:27,y:43},
{id:'g112',label:'Galgos 112',type:'RESCUE_SHELTER',stance:'ANTI_HUNTING',x:18,y:76},
{id:'carlota',label:'112 Carlota Galgos',type:'RESCUE_SHELTER',stance:'ANTI_HUNTING',x:9,y:65},
{id:'gin',label:'Greyhounds in Need UK',type:'RESCUE_NETWORK_INTL',stance:'WELFARE_NEUTRAL',x:5,y:82},
{id:'grin',label:'Galgo Rescue International Network',type:'RESCUE_NETWORK_INTL',stance:'WELFARE_NEUTRAL',x:7,y:30},
{id:'project-galgo',label:'Project Galgo',type:'RESCUE_NETWORK_INTL',stance:'ANTI_HUNTING',x:17,y:90},
{id:'sage',label:'SAGE — Save A Galgo Español',type:'RESCUE_NETWORK_INTL',stance:'WELFARE_NEUTRAL',x:30,y:91},
{id:'feg',label:'Federación Española de Galgos',type:'HUNTING_FEDERATION',stance:'PRO_HUNTING',x:78,y:22},
{id:'rfec',label:'Real Federación Española de Caza',type:'HUNTING_FEDERATION',stance:'PRO_HUNTING',x:88,y:38},
{id:'rsce',label:'Real Sociedad Canina de España',type:'BREED_KENNEL_CLUB',stance:'REGULATORY',x:67,y:10},
{id:'cnge',label:'Club Nacional del Galgo Español',type:'BREED_KENNEL_CLUB',stance:'REGULATORY',x:80,y:9},
{id:'fci',label:'Fédération Cynologique Internationale',type:'BREED_KENNEL_CLUB',stance:'REGULATORY',x:93,y:12},
{id:'dgda',label:'Dirección General de Derechos de los Animales',type:'GOVERNMENT_AGENCY',stance:'REGULATORY',x:65,y:47},
{id:'mapa',label:'Ministerio de Agricultura, Pesca y Alimentación',type:'GOVERNMENT_AGENCY',stance:'REGULATORY',x:77,y:56},
{id:'seprona',label:'SEPRONA',type:'GOVERNMENT_AGENCY',stance:'REGULATORY',x:91,y:61},
{id:'nac',label:'Plataforma NAC',type:'UMBRELLA_COALITION',stance:'ANTI_HUNTING',x:51,y:72},
{id:'pacma',label:'PACMA',type:'POLITICAL_PARTY',stance:'ANTI_HUNTING',x:63,y:82},
{id:'anima',label:'AnimaNaturalis',type:'ADVOCACY_POLICY',stance:'ANTI_HUNTING',x:49,y:88},
{id:'cas',label:'CAS International',type:'ADVOCACY_POLICY',stance:'ANTI_HUNTING',x:39,y:83},
{id:'intercids',label:'INTERcids',type:'LEGAL',stance:'WELFARE_NEUTRAL',x:73,y:91},
{id:'ojda',label:'Observatorio Justicia y Defensa Animal',type:'LEGAL',stance:'ANTI_HUNTING',x:86,y:86},
{id:'faada',label:'FAADA',type:'LEGAL',stance:'WELFARE_NEUTRAL',x:94,y:76},
{id:'affinity',label:'Fundación Affinity',type:'VETERINARY_SCIENTIFIC',stance:'WELFARE_NEUTRAL',x:52,y:96},
{id:'law',label:'Ley 7/2023',type:'LAW',stance:'REGULATORY',x:55,y:38},
{id:'exemption',label:'Hunting-dog exemption in Ley 7/2023',type:'POLICY',x:52,y:53},
{id:'championship',label:'Campeonato de España de Galgos en Campo',type:'EVENT',x:91,y:25},
];

const source='Institutional_Map_Galgo_Espanol_2026.md';
export const institutionalEdges:InstitutionalEdge[]=[
{id:'e1',source:'feg',target:'championship',predicate:'HOSTS_EVENT',confidence:1,repositoryPath:source},
{id:'e2',source:'cnge',target:'rsce',predicate:'MEMBER_OF',confidence:1,repositoryPath:source},
{id:'e3',source:'rsce',target:'fci',predicate:'MEMBER_OF',confidence:1,repositoryPath:source},
{id:'e4',source:'rfec',target:'nac',predicate:'OPPOSED_TO',confidence:.95,repositoryPath:source},
{id:'e5',source:'rfec',target:'dgda',predicate:'OPPOSED_TO',confidence:.95,repositoryPath:source},
{id:'e6',source:'sos-galgos',target:'exemption',predicate:'OPPOSED_TO',confidence:1,repositoryPath:source},
{id:'e7',source:'nac',target:'exemption',predicate:'OPPOSED_TO',confidence:1,repositoryPath:source},
{id:'e8',source:'pacma',target:'exemption',predicate:'OPPOSED_TO',confidence:1,repositoryPath:source},
{id:'e9',source:'anima',target:'exemption',predicate:'OPPOSED_TO',confidence:1,repositoryPath:source},
{id:'e10',source:'cas',target:'exemption',predicate:'OPPOSED_TO',confidence:1,repositoryPath:source},
{id:'e11',source:'anima',target:'cas',predicate:'COLLABORATES_WITH',confidence:1,repositoryPath:source},
{id:'e12',source:'gin',target:'gds',predicate:'FUNDER_OF',confidence:.95,repositoryPath:source},
{id:'e13',source:'project-galgo',target:'fbm',predicate:'PARTNER_OF',confidence:1,repositoryPath:source},
{id:'e14',source:'sage',target:'fbm',predicate:'PARTNER_OF',confidence:1,repositoryPath:source},
{id:'e15',source:'intercids',target:'g112',predicate:'COLLABORATES_WITH',confidence:1,repositoryPath:source},
{id:'e16',source:'dgda',target:'law',predicate:'REGULATES_VIA',confidence:1,repositoryPath:source},
{id:'e17',source:'pacma',target:'gdsur',predicate:'COLLABORATES_WITH',confidence:.8,repositoryPath:source},
];

export const institutionTypeGroups={
rescue:['RESCUE_SHELTER','RESCUE_NETWORK_INTL'],
governance:['HUNTING_FEDERATION','BREED_KENNEL_CLUB','GOVERNMENT_AGENCY','LAW','POLICY','EVENT'],
advocacy:['UMBRELLA_COALITION','POLITICAL_PARTY','ADVOCACY_POLICY','LEGAL','VETERINARY_SCIENTIFIC'],
} as const;

export const graphSourceSlug='galgo-espanol-institutional-map';
