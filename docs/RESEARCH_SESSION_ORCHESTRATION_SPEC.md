# GALGO/7 Research Session Orchestration

## Purpose
Create a persistent, cross-surface research trail spanning Timeline, Institutional Graph, Archive and Ask without promoting navigation history into evidence.

## Core rule
Research context is **navigation state only**. It must never change evidence level, source quality, review status, graph confidence, retrieval weighting or factual claims.

## Persistence
- Browser-local only via `localStorage`.
- No account identity.
- No database table.
- No server-side user profile.
- Maximum 12 recent context items.
- User can clear the trail at any time.

## Captured context
- route visits across core research surfaces;
- Ask Archive questions carried in `?q=`;
- archive document routes;
- timeline event selections;
- institutional graph node selections;
- institutional relationship selections.

## Context object
Each entry contains only:
- surface;
- kind;
- human-readable label;
- internal route;
- optional display detail;
- local timestamp.

## Cross-surface actions
The current focus may be carried into Ask Archive as a visible question parameter. Timeline, Graph and Archive navigation remain explicit user actions. Context is never silently injected into RAG prompts.

## Evidence safeguards
- Trail state is not evidence.
- Trail state does not alter source ordering or retrieval weights.
- Trail state does not create graph edges.
- A sequence of visited records does not imply chronology, lineage, influence or causality.
- The interface must visibly disclose these constraints.

## Accessibility / UX
- Persistent dock available on all pages.
- Collapsible panel.
- Current focus shown before opening.
- Trail entries are links back to their original surface.
- Clear-trail control is always available when entries exist.
- Responsive mobile behavior.

## Production safety
No schema migration, Neon write, RAG ingestion change, retrieval-weight change or graph semantic change is required.
