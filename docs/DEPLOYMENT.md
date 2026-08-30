# GALGO/7 — DEPLOYMENT

## Preview-only foundation

This document is part of the feature-branch build. The canonical research Markdown remains read-only. Production Neon is never a target for this workflow.

## Governing constraints

- Seven evidence labels are stored verbatim: Confirmed, Probable, Plausible, Disputed, Traditional claim, Unsupported, Disproven or materially misleading.
- Five continuity dimensions remain independent: function, morphological type, population, name, formal breed.
- Every retrieval unit must retain document, heading path, and line provenance.
- Lakebase Search and Postgres are the sole production retrieval and graph store.

## Implementation note

See the migration, corpus parser, and application routes for the executable foundation. Complete this document during the preview-branch implementation review before any production promotion.
