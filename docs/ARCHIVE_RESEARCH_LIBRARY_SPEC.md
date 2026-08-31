# GALGOS Archive Research Library — Product & Evidence Specification

## Purpose
Turn the corpus archive from a file list into a navigable research library while preserving the distinctions already encoded in the corpus.

## Principal rule
Discovery metadata may help users find documents; it must never silently upgrade the evidential status of a document or claim.

## Corpus status semantics
- `canonical`: curated corpus record used at full retrieval weight.
- `methodology`: research-governance material describing method, source hierarchy or claim classification.
- `legacy`: retained source/research record, including raw Compass research uploads; it remains retrievable but is not presented as equivalent to a canonical synthesis.

Corpus status is a retrieval/provenance classification. It is not itself a claim-level truth score.

## Frontmatter evidence semantics
Display source-provided frontmatter where available:
- `document_id`
- `document_type`
- `evidence_level`
- `review_status`
- `source_quality`
- `period_start` / `period_end`
- `language`
- `batch`
- `topics`
- `geographies`
- `people`
- `entities`
- `dog_types`

Missing fields remain visibly absent or `not classified`; they are never inferred from prose solely to complete the UI.

## Research-library views
1. **All records** — complete corpus.
2. **Canonical** — curated research records.
3. **Methodology** — research method and evidence-governance documents.
4. **Source records** — legacy/raw retained research.

## Faceted discovery
Allowed facets derive from corpus metadata only:
- corpus status
- document type
- evidence level
- review status
- historical period
- topic
- geography

Free-text search may match title, repository path, document ID and explicit metadata values.

## Related documents
Related-document recommendations are a discovery aid, not a knowledge-graph edge.

A related score may be derived from overlap in explicit metadata only:
- topics
- geographies
- entities
- people
- dog types
- batch
- period overlap

The UI must label this as metadata similarity / shared research context, never historical influence, ancestry or factual dependency.

## Provenance / lineage
Only explicit or manually curated lineage relationships may be displayed as lineage.

Current explicit curated lineage:
- `compass_artifact_wf-2bff7e45-e211-5090-bb0c-5247bc9b6224_text_markdown.md` → source record for → `Institutional_Map_Galgo_Espanol_2026.md`.

Do not infer lineage between other raw and canonical files from semantic similarity alone.

## Document reader
Each document page should expose, before the body:
- record identity and corpus status;
- evidence/review/source-quality metadata when present;
- explicit topics/geographies/period;
- repository path;
- lineage when explicitly known;
- direct actions to Ask Archive, Timeline and Graph.

The Markdown body remains the authoritative document text. UI summaries must not replace it.

## Visual / interaction system
Use the existing GALGO/7 digital design system:
- Fraunces editorial display typography;
- Geist UI typography;
- DM Mono evidence/provenance labels;
- dark glass research surfaces;
- Galgo spectrum colors used semantically and sparingly.

## QA gates
- No facet value is invented from missing metadata.
- Raw/source records remain visibly distinct from canonical records.
- Related-document cards are labelled as metadata-based discovery.
- Explicit lineage is never generated from similarity.
- Every card links to an actual corpus document slug.
- Search/filter combinations have a clear empty state.
- Keyboard and mobile access are supported.
- Archive and reader remain usable if optional metadata fields are absent.
