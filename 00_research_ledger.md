---
document_id: "GE-00-06"
title: "Research Ledger"
slug: "research-ledger"
batch: "00"
document_type: "timeline"
language: "en"
source_languages: []
period_start: ""
period_end: "2026"
geographies: []
entities: []
people: []
dog_types: []
topics: ["project tracking", "corpus status", "research gaps"]
evidence_level: "confirmed"
source_quality: "internal_corpus_register"
created_at: "2026-08-30"
updated_at: "2026-08-31"
version: "2.0"
citation_count: 0
review_status: "verified-against-repository"
---

# Research Ledger

Current repository-level tracking for GALGOS. **File presence is not the same as claim verification.** For evidence-quality caveats see `Corpus_Gaps_and_Verification_Audit_2026.md`.

| Batch / layer | Scope | Repository status | Evidence / follow-up status |
|---|---|---|---|
| 00 | Research architecture, methodology, source hierarchy, terminology, audit | **Present** | Active governance layer |
| 01–08 | Prehistory → early modern 1450–1700 | **Coverage exists in synthesis/source material; clean canonical batch files require reconciliation** | Priority rebuild from primary/source-mapped records |
| 09 | 1700–1900 enriched | **Present** | Source verification should continue object-by-object |
| 10 | 1900–2000 enriched | **Present** | Strengthen press, club, canódromo and named-dog primary records |
| 11 | 2000–2026 enriched | **Present** | Preserve conflicting welfare/statistical systems separately |
| 12 | English Greyhound crosses and diaspora | **Present** | Population-genetic impact remains an evidence question |
| 13 | Comparative Iberian sighthounds | **Present** | Comparative synthesis; do not infer ancestry from similarity |
| 14 | Synthesis / compilation | **Present** | Secondary synthesis inside this corpus; resolve claims back to source records |
| 15 | Primary-source archival roadmap | **Present** | New active acquisition programme |
| 16 | Visual and material culture evidence atlas | **Present** | v1 anchors + provenance methodology; expand object-by-object |
| Institutional canonical | Institutional and organizational map | **Present** | Explicit graph relationships only |
| Yo Galgo canonical | Documentary / media evidence record | **Present** | Source-mapped canonical record |

## Current research priorities

### P0 — primary-source correction of high-risk origin claims

- Locate and image-check exact legal provisions behind recurring Fuero de Salamanca / Fuero de Coria galgo claims.
- Resolve classical `vertragus` evidence without converting functional analogy into biological descent.
- Verify earliest datable uses of `galgo`, `galga` and `lebrel` at witness/page level.
- Keep Al-Andalus / North-African hunting evidence separate from unsupported population-ancestry claims.

### P1 — canonicalize earlier periods

Rebuild clean, source-mapped canonical records for Batches 01–08 so the early history is not dependent on synthesis prose or legacy source records.

### P2 — institutional and social history

- Contemporary press timeline for clubs, coursing competitions and canódromos.
- Named-dog / breeder / owner records where evidence permits.
- Modern formal-breed governance from RSCE / FCI primary sources.
- Legislative history from BOE and parliamentary records.

### P3 — visual/material evidence

- San Baudelio object-level records and rights-cleared reproductions.
- Paul de Vos, *Un galgo blanco* object record and reusable image source.
- BNE hunting-book plates labelled `galgo` / `lebrel`.
- Historical press photography, race programmes, federation and club imagery.

## Known high-risk claims

- The popular "Fuero de Salamanca" galgo story — exact provision/witness still requires primary-source verification.
- Whether Arrian's coursing dogs establish ancestry for the modern Galgo Español — they do not by themselves.
- The supposed "Codex Romanicus" — treat as a garbled popular reference unless an exact work is identified.
- "Galgo descends from the vertragus" and "galgo descends from the Moorish sloughi" — evaluate separately across function, type, population, name and formal-breed continuity.
- Any claim of unbroken genetic/population continuity from antiquity to the present-day breed.
- Any single national abandonment figure produced by flattening incompatible datasets.

## Runtime / ingestion governance

Corpus files are versioned in GitHub. Production ingestion is performed by the Vercel build/release workflow into the **Vercel-connected Neon database**. The research workflow should not make direct Neon connector edits.

## Suggested RAG questions

- What is currently present in the GALGOS corpus, and what still needs canonicalization?
- Which claims remain highest-risk and why?
- Which primary repositories are prioritized for the next research phase?
- What does the visual evidence support without proving breed ancestry?
