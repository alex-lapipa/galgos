# GALGOS Institutional Landscape — Exhibit Specification

## Decision / question
How is the contemporary Galgo Español shaped by interacting rescue, hunting/coursing, cynological, governmental, advocacy, legal and scientific institutions — and what does the evidence actually support about their relationships?

## Principal takeaway
The galgo is not governed by one sector. It sits inside overlapping institutional systems whose relationships include governance, partnership, funding, collaboration and documented opposition. Ley 7/2023 is the clearest current conflict node in the available corpus.

## Evidence scope
- Canonical source: `Institutional_Map_Galgo_Espanol_2026.md` (`GE-11-INSTITUTIONS-01`).
- Source record retained unchanged: `compass_artifact_wf-2bff7e45-e211-5090-bb0c-5247bc9b6224_text_markdown.md`.
- Network edges must originate from explicit `graph_relationships` metadata in the canonical record.
- Node type and stance must originate from explicit `graph_nodes` properties.
- Supporting passages must be fetched from stored corpus chunks with repository path and line range.

## Evidence semantics
- `OPPOSED_TO` means a documented institutional position only. It does not imply equal power, equal evidence quality, moral equivalence or causality.
- `PARTNER_OF`, `FUNDER_OF`, `COLLABORATES_WITH`, `MEMBER_OF`, `HOSTS_EVENT` and `REGULATES_VIA` are relationship predicates, not magnitude measures.
- Numeric graph `confidence` is curation metadata, not statistical probability and must not be visualized as percentage precision.
- Contested abandonment estimates remain RAG text and are not rendered as verified graph facts.
- Proximity in the layout is a presentation device and must never be described as evidence of influence, ancestry or causality.

## Visual grammar
Primary: knowledge graph / ecosystem map.
Secondary: categorical filters, typed relationship legend, source drawer with exact passages.

## Views
1. Landscape — all explicit institutional relationships.
2. Ley 7/2023 — policy conflict centered on the hunting-dog exemption and regulatory context.
3. Rescue network — Spanish rescue nodes and international partners/funders.
4. Governance — coursing, hunting, cynological and regulatory bodies.

## Layout rules
- Deterministic semantic zones rather than force-directed proximity.
- Policy/law nodes occupy the central policy zone.
- Rescue / international rescue occupy the left network zone.
- Hunting/coursing and breed governance occupy the right/top governance zone.
- Advocacy/legal/scientific actors occupy lower institutional zones.
- Edges use type-specific stroke semantics; line width carries no quantitative meaning.

## Interaction
- Filter by view, stance, organization type and relationship type.
- Search nodes by label.
- Select node: show type, stance, direct relationships and supporting KB passages.
- Select edge: show exact predicate, endpoints, evidence status, provenance and supporting passages.
- Every evidence drawer links to the canonical archive document.
- `Ask archive` carries the selected entity/relationship into the existing `/ask` surface.

## QA gates
- No rendered edge absent from explicit graph metadata.
- No unsupported direction reversal.
- No numeric confidence percentage in client-facing UI.
- Every selected edge exposes source path and passage lines.
- Keyboard-selectable nodes and accessible text fallback for relationships.
- Responsive layout with no clipped labels at 390px, 768px, 1280px and 1600px widths.
- English and Spanish interface copy; entity names remain canonical.
