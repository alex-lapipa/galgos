# GALGO/7 Navigation + Live Graph Unification

## Purpose
Unify movement across GALGO/7 research surfaces while replacing the institutional graph's duplicated evidence model with read-only Neon-backed data.

## Navigation rules
- Language switching must preserve the current localized surface when an EN/ES equivalent exists.
- Timeline and Institutional Graph switch directly between `/en/*` and `/es/*` equivalents.
- Non-localized surfaces remain on the same route.
- Active Ask query context may remain visible in navigation and breadcrumbs, but navigation context is not evidence.
- Breadcrumbs describe interface location only.

## Institutional graph architecture
Evidence semantics and presentation layout are deliberately separated.

### Evidence/data layer
Production graph data is loaded read-only from Neon:
- canonical node inventory comes from the ingested `Institutional_Map_Galgo_Espanol_2026.md` frontmatter;
- displayed relationships come from `galgo.graph_edges` joined to `galgo.graph_nodes` and restricted to that canonical document;
- `MAPS_NODE` provenance plumbing is excluded from the displayed institutional relationship layer;
- relationship confidence remains curation metadata and is not displayed as statistical probability.

### Presentation layer
`lib/institutional-map.ts` remains a deterministic coordinate/layout map and outage fallback.
- x/y position is presentation-only;
- proximity does not establish influence, similarity, ancestry or causality;
- layout does not create or delete evidence relationships.

## Failure behavior
If the live graph API is unavailable, the interface falls back to the last deterministic curated 30-node / 17-relationship map and labels itself as a fallback. A database/API interruption must not silently produce an empty exhibit.

## Evidence safeguards
- Only stored explicit relationships are rendered as edges in live mode.
- `OPPOSED_TO` means a documented relationship only and does not imply equal power, evidence quality, moral equivalence or causality.
- Contested abandonment estimates remain textual RAG evidence and never become graph facts.
- Navigation breadcrumbs, research trails and visual position never alter evidence level, source quality, review status or graph confidence.

## Production safety
- No schema migration.
- No Neon write.
- No graph mutation.
- No retrieval-weight change.
- Read-only API only.
