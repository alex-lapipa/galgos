# GALGO/7 UX, Accessibility and Deep-Link Specification

## Objective
Finish the research environment as a coherent product: every selected evidence object can be linked directly, context survives movement between research surfaces, transitions feel intentional without blocking use, and accessibility/resilience are first-class constraints.

## Non-negotiable evidence rule
Navigation state, selected-object state, breadcrumbs, animation and layout are presentation/context only. They never change evidence level, source quality, review status, retrieval weights, graph confidence, relationship semantics or factual conclusions.

## Deep links
### Timeline
Canonical query form: `/{locale}/timeline?event=<timeline-event-id>`.
- Valid event IDs open that event drawer on load and move the horizontal timeline to its era/position.
- Invalid IDs are ignored without inventing a selection.
- Selecting a timeline event updates the browser URL so the current evidence state can be copied/bookmarked.
- Closing the event removes the `event` parameter while preserving the route.

### Institutional Graph
Canonical query forms:
- `/{locale}/graph?node=<institutional-node-id>`
- `/{locale}/graph?edge=<institutional-edge-id>`

Rules:
- Node/edge IDs must exist in the currently loaded live-or-fallback graph dataset.
- Valid IDs open the evidence drawer on load.
- Invalid IDs are ignored.
- Selecting or closing graph objects updates the URL without changing graph evidence.

### Archive / Ask
Archive records remain path-addressable. Ask questions remain explicitly addressable with `?q=`. These are preserved by contextual navigation.

## Contextual navigation
The global breadcrumb layer should distinguish surface, selected timeline event, selected graph node/edge, archive record, and Ask question. The label is a navigation affordance only; it is not evidence metadata.

## Research Trail
Trail links should use the direct selected-object URL when one exists, not only the parent research surface.

## Motion
Use native CSS/React interaction motion owned by GALGO/7.
- page/surface entrance: brief opacity + translate only;
- drawers/panels: brief opacity/transform;
- no motion required to understand evidence;
- no long blocking transitions;
- `prefers-reduced-motion: reduce` disables non-essential transitions, smooth scrolling and decorative animation.

## Keyboard and focus
- all interactive evidence nodes remain native buttons/links;
- add a visible `:focus-visible` system with sufficient contrast;
- active/selected objects expose `aria-pressed` or equivalent state where appropriate;
- overlays/drawers remain dismissible by a visible close control and Escape where practical;
- no click-only interaction may be required for research access.

## Loading and failure
- live institutional graph announces loading status;
- fallback status is visible and understandable;
- evidence retrieval errors do not remove selected-object identity or provenance context;
- loading/error states use `role=status` / live-region semantics where appropriate.

## Mobile
Target widths: 390, 768, 1280 and 1600px.
- navigation must wrap/scroll without hiding core research surfaces;
- breadcrumb text truncates safely;
- persistent research trail must not obscure primary controls;
- minimum practical touch target should be approximately 40px where layout permits.

## QA gates
- direct Timeline event URL restores valid event selection;
- direct Graph node/edge URL restores valid graph selection;
- closing selection cleans URL;
- language switch preserves selected event/node/edge query parameters;
- Research Trail reopens selected object directly;
- keyboard focus is visibly distinguishable;
- reduced-motion media query disables non-essential animation and smooth scrolling;
- live graph failure still yields deterministic fallback;
- no DB migration, graph mutation, RAG change or evidence-classification change.
