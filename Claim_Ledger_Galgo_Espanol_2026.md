---
document_id: "GE-CLAIMS-2026-01"
title: "Galgo Español Claim Ledger"
slug: "galgo-espanol-claim-ledger"
batch: "claims"
document_type: "claim_register"
corpus_status: "canonical"
source_role: "claim_register"
language: "en"
source_languages: ["en", "es", "la"]
period_start: ""
period_end: "2026"
geographies: ["Spain", "Iberian Peninsula"]
entities: ["Galgo Español"]
people: []
dog_types: ["galgo", "sighthound", "lebrel", "vertragus", "Greyhound", "Sloughi"]
topics: ["claims", "evidence classification", "continuity", "research gaps", "myth correction"]
evidence_level: "mixed"
source_quality: "internal_claim_register_resolved_to_corpus_sources"
created_at: "2026-08-31"
updated_at: "2026-08-31"
version: "1.1"
review_status: "active_review"
claim_records:
  - claim_id: "GE-C001"
    statement: "The modern Galgo Español descends directly and continuously from the Roman vertragus."
    dimension: "population"
    evidence_level: "traditional claim"
    review_status: "unresolved"
    supporting_sources: ["00_claim_classification_framework.md", "Batch_14_Synthesis_and_Compilation.md"]
    contradicting_or_limiting_sources: ["Corpus_Gaps_and_Verification_Audit_2026.md"]
    note: "Functional and morphological analogy must not be converted into population continuity without genetic or documentary transmission evidence."
  - claim_id: "GE-C002"
    statement: "The Galgo Español descends directly from North African Sloughi introduced through Al-Andalus."
    dimension: "population"
    evidence_level: "traditional claim"
    review_status: "unresolved"
    supporting_sources: ["Batch_14_Synthesis_and_Compilation.md"]
    contradicting_or_limiting_sources: ["Corpus_Gaps_and_Verification_Audit_2026.md"]
    note: "Hunting traditions and similar sighthound types do not by themselves demonstrate a population-level ancestry event."
  - claim_id: "GE-C003"
    statement: "The surviving Fuero de Salamanca textual tradition contains a legal provision explicitly naming a galgo."
    dimension: "name"
    evidence_level: "confirmed"
    review_status: "source_mapped_reference_edition"
    supporting_sources: ["Primary_Source_Fuero_de_Salamanca_Galgo_Provision.md"]
    contradicting_or_limiting_sources: []
    note: "The RAE historical corpus indexes the galgo dog-valuation rule as Fuero de Salamanca §195 from the Castro/Onís 1916 reference edition. This confirms medieval lexical/legal visibility, not modern breed-population continuity."
  - claim_id: "GE-C004"
    statement: "Between 50,000 and 100,000 galgos are abandoned in Spain every year."
    dimension: "cross-cutting"
    evidence_level: "disputed"
    review_status: "methodologically_incomparable_sources"
    supporting_sources: ["Batch_11_The_Galgo_Espanol_21st_Century_2000_2026.md"]
    contradicting_or_limiting_sources: ["Corpus_Gaps_and_Verification_Audit_2026.md"]
    note: "NGO estimates, SEPRONA-derived figures, protectora surveys and Fundación Affinity data use different systems and denominators and must not be flattened into one national statistic."
  - claim_id: "GE-C005"
    statement: "The Galgo Español is formally recognized by the FCI as breed number 285."
    dimension: "formal breed"
    evidence_level: "confirmed"
    review_status: "source_mapped"
    supporting_sources: ["Batch_15_Archival_Roadmap_Primary_Source_Programme.md"]
    contradicting_or_limiting_sources: []
    note: "Modern institutional recognition is direct evidence for formal breed status; it does not retroactively create formal breed continuity in medieval or ancient periods."
  - claim_id: "GE-C006"
    statement: "English Greyhound crossing occurred within twentieth-century Spanish galgo populations."
    dimension: "population"
    evidence_level: "confirmed"
    review_status: "scope_and_legacy_require_further_quantification"
    supporting_sources: ["Batch_09_Galgo_Espanol_1700-1900_Enriched.md", "Batch_10_The_Galgo_Espanol_20th_Century_1900_2000.md", "Batch_12_English_Greyhound_Crosses_and_Postcolonial_Diaspora_Galgos.md"]
    contradicting_or_limiting_sources: ["Corpus_Gaps_and_Verification_Audit_2026.md"]
    note: "The existence of crossing is supported; its scale, named breeding programmes and persistence in present populations require more precise historical and genomic resolution."
  - claim_id: "GE-C007"
    statement: "Paul de Vos's Un galgo blanco is a seventeenth-century Spanish royal-collection visual and naming anchor for a galgo."
    dimension: "name"
    evidence_level: "confirmed"
    review_status: "object_record_source_mapped"
    supporting_sources: ["Batch_16_Visual_Material_Culture_Evidence_Atlas.md", "Batch_15_Archival_Roadmap_Primary_Source_Programme.md"]
    contradicting_or_limiting_sources: []
    note: "The object supports cultural representation, naming and visual type; it does not establish a pedigree to the modern registered breed."
  - claim_id: "GE-C008"
    statement: "The San Baudelio hunting frescoes prove that the modern Galgo Español existed as the same breed in the twelfth century."
    dimension: "formal breed"
    evidence_level: "unsupported"
    review_status: "resolved_as_overclaim"
    supporting_sources: []
    contradicting_or_limiting_sources: ["Batch_16_Visual_Material_Culture_Evidence_Atlas.md"]
    note: "The frescoes support medieval Iberian hunting-dog function and broad visual type, not modern formal breed identity or population continuity."
  - claim_id: "GE-C009"
    statement: "A Roman work called the Codex Romanicus catalogued the Galgo Español."
    dimension: "name"
    evidence_level: "disproven or materially misleading"
    review_status: "resolved_as_garbled_reference"
    supporting_sources: []
    contradicting_or_limiting_sources: ["00_research_ledger.md", "Corpus_Gaps_and_Verification_Audit_2026.md"]
    note: "Treat Codex Romanicus as a garbled popular reference unless an exact classical work is identified."
  - claim_id: "GE-C010"
    statement: "The Fuero de Salamanca galgo provision is a ninth-century law."
    dimension: "name"
    evidence_level: "disproven or materially misleading"
    review_status: "resolved_textual_chronology"
    supporting_sources: []
    contradicting_or_limiting_sources: ["Primary_Source_Fuero_de_Salamanca_Galgo_Provision.md"]
    note: "The surviving extensive fuero/manuscript tradition is medieval and the RAE indexes the cited reference-edition passage around c.1300. Earlier lost legal layers must not be used to date this specific clause to the ninth century."
---

# Galgo Español Claim Ledger

## Purpose

This register turns recurring historical assertions into auditable research objects. It is designed for public reading, RAG retrieval and future claim-level interfaces.

A claim record does **not** become true because it is present here. Its `evidence_level` expresses the current classification under `00_claim_classification_framework.md`, while `review_status` states what remains to be resolved.

## Governing rule

The ledger preserves the distinction between evidence for function, morphological type, population, name and formal breed. A source may strongly support one continuity dimension while providing no evidence for another.

## Public interpretation

- **Confirmed** means directly supported by strong source evidence for the claim as worded.
- **Probable** means convergent evidence exists but does not definitively demonstrate the claim.
- **Plausible** means historically possible with limited or indirect evidence.
- **Disputed** means credible evidence systems or authorities disagree.
- **Traditional claim** means repeated but not independently demonstrated.
- **Unsupported** means reliable support has not been located.
- **Disproven or materially misleading** means stronger evidence contradicts the claim as usually stated.

## Research use

Every public claim interface should show the exact wording, evidence classification, continuity dimension, supporting sources, limiting or contradicting sources, review state and the unresolved research question. Synthesis prose must not silently upgrade a claim beyond this register.
