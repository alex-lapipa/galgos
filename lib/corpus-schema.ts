import {z} from 'zod';

export const corpusStatusSchema=z.enum(['canonical','methodology','legacy']);
export const sourceRoleSchema=z.enum([
 'primary_source','object_record','scientific_source','institutional_source',
 'research_synthesis','master_synthesis','methodology','claim_register',
 'corpus_audit','archival_roadmap','legacy_research','reference'
]);

export type CorpusStatus=z.infer<typeof corpusStatusSchema>;
export type SourceRole=z.infer<typeof sourceRoleSchema>;

const transitionalRoles:Record<string,SourceRole>={
 'Batch_09_Galgo_Espanol_1700-1900_Enriched.md':'research_synthesis',
 'Batch_10_The_Galgo_Espanol_20th_Century_1900_2000.md':'research_synthesis',
 'Batch_11_The_Galgo_Espanol_21st_Century_2000_2026.md':'research_synthesis',
 'Batch_12_English_Greyhound_Crosses_and_Postcolonial_Diaspora_Galgos.md':'research_synthesis',
 'Batch_13_Comparative_Iberian_Sighthound_Study.md':'research_synthesis',
 'Batch_14_Synthesis_and_Compilation.md':'master_synthesis',
 'Institutional_Map_Galgo_Espanol_2026.md':'institutional_source',
 'Yo_Galgo_Documentary_2018.md':'reference',
 'Batch_15_Archival_Roadmap_Primary_Source_Programme.md':'archival_roadmap',
 'Batch_16_Visual_Material_Culture_Evidence_Atlas.md':'object_record',
 'Corpus_Gaps_and_Verification_Audit_2026.md':'corpus_audit',
};

export function resolveCorpusPolicy(file:string,data:Record<string,unknown>){
 const explicitStatus=corpusStatusSchema.safeParse(data.corpus_status);
 const explicitRole=sourceRoleSchema.safeParse(data.source_role);
 const fallbackStatus:CorpusStatus=file.startsWith('compass_')?'legacy':file.startsWith('00_')?'methodology':'canonical';
 const fallbackRole:SourceRole=transitionalRoles[file]??(file.startsWith('compass_')?'legacy_research':file.startsWith('00_')?'methodology':'reference');
 const warnings:string[]=[];
 if(!explicitStatus.success)warnings.push(`${file}: missing explicit corpus_status; transitional ${fallbackStatus} fallback used`);
 if(!explicitRole.success)warnings.push(`${file}: missing explicit source_role; transitional ${fallbackRole} fallback used`);
 return {status:explicitStatus.success?explicitStatus.data:fallbackStatus,sourceRole:explicitRole.success?explicitRole.data:fallbackRole,warnings};
}
