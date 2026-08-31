import {getCorpusDocument} from './corpus';

export const EVIDENCE_LEVELS=['confirmed','probable','plausible','disputed','traditional claim','unsupported','disproven or materially misleading'] as const;
export const CONTINUITY_DIMENSIONS=['function','type','population','name','formal breed','cross-cutting'] as const;

export type EvidenceLevel=typeof EVIDENCE_LEVELS[number];
export type ContinuityDimension=typeof CONTINUITY_DIMENSIONS[number];
export type ClaimRecord={
  claimId:string;
  statement:string;
  dimension:ContinuityDimension;
  evidenceLevel:EvidenceLevel;
  reviewStatus:string;
  supportingSources:string[];
  limitingSources:string[];
  note:string;
};

function strings(value:unknown){return Array.isArray(value)?value.map(String).filter(Boolean):[]}

export async function listClaims():Promise<ClaimRecord[]>{
  const doc=await getCorpusDocument('galgo-espanol-claim-ledger');
  const records=Array.isArray(doc?.frontmatter.claim_records)?doc?.frontmatter.claim_records:[];
  return records.flatMap(raw=>{
    if(!raw||typeof raw!=='object')return [];
    const item=raw as Record<string,unknown>;
    const claimId=String(item.claim_id||'').trim();
    const statement=String(item.statement||'').trim();
    const dimension=String(item.dimension||'').trim() as ContinuityDimension;
    const evidenceLevel=String(item.evidence_level||'').trim() as EvidenceLevel;
    if(!claimId||!statement||!CONTINUITY_DIMENSIONS.includes(dimension)||!EVIDENCE_LEVELS.includes(evidenceLevel))return [];
    return [{
      claimId,statement,dimension,evidenceLevel,
      reviewStatus:String(item.review_status||'unreviewed'),
      supportingSources:strings(item.supporting_sources),
      limitingSources:strings(item.contradicting_or_limiting_sources),
      note:String(item.note||'')
    }];
  });
}
