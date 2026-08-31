# GALGOS Gold Evaluation Contract

## Purpose

The evaluation system protects the public research experience from two different classes of regression:

1. **Retrieval regressions** — the right evidence does not appear, or one long synthesis crowds out independent records.
2. **Answer-contract regressions** — Ask Archive returns malformed citations, missing provenance, weak paragraph citation coverage or loses its explicit evidence-status conclusion.

These checks measure system behavior. They do **not** automatically establish historical truth.

## Gold set

`eval/gold-questions.ts` currently contains **48 bilingual research questions** across:

- classical vertragus / Vertraha evidence;
- ancient Iberian-labelled dog stock;
- myth correction;
- continuity methodology;
- medieval law;
- visual evidence;
- formal breed history;
- Greyhound crossing;
- comparative sighthound claims;
- Ley 7/2023 and institutions;
- abandonment/welfare data;
- Yo Galgo;
- corpus governance and archives;
- synthesis questions;
- deliberately impossible questions;
- source-role discipline.

Expected path needles mean that at least one relevant canonical/methodological record should appear in the retrieved set. They are recall expectations, not exclusive answers and not truth labels.

## Preferred retrieval evaluator: Vercel HTTP path

Run from any authorized workstation:

`GALGOS_BASE_URL=https://galgos.alexlawton.ai pnpm rag:eval:gold:http`

This is the preferred external regression path because it preserves the production architecture exactly:

**Gold questions → Vercel `/api/search` → Vercel-connected Neon**

The workstation never receives `DATABASE_URL` and never connects to Neon directly.

`/api/search` returns retrieval output enriched with non-sensitive corpus metadata needed for evaluation:

- `corpusStatus`;
- `sourceRole`;
- `evidenceLevel`;
- `reviewStatus`.

The HTTP evaluator measures:

- recall against expected source families;
- average distinct documents in the top ten;
- average source-role diversity;
- worst single-document concentration;
- recall by category;
- HTTP failures.

Current release thresholds:

- zero HTTP failures;
- overall recall >= 0.85;
- average distinct documents >= 3;
- no single document may exceed 50% of a top-ten result set.

Source-role diversity is reported but is not yet a hard threshold because a narrow primary-source question can legitimately resolve to one source family.

## Internal/direct retrieval evaluator

`pnpm rag:eval:gold`

This calls the retrieval library directly and therefore requires the normal Vercel production-equivalent model/database environment. It is useful inside trusted Vercel/internal execution, but it is **not** the preferred workstation path because GALGOS keeps Neon behind Vercel.

## Ask contract evaluator

Run:

`GALGOS_BASE_URL=https://galgos.alexlawton.ai pnpm ask:eval:contract`

This runs against the deployed Vercel surface and samples the Gold set. It validates:

- HTTP success;
- every `usedCitationId` exists in the returned citation payload;
- every rendered `[n]` marker resolves to a returned citation;
- paragraph citation coverage is at least 75%;
- the answer includes the required `Evidence status:` / `Estado de la evidencia:` conclusion;
- citations contain path, exact line range, excerpt and source role for inspection.

A 90% contract pass rate is required.

### First recorded production run

On 2026-09-01 the evaluator was run from the authorized workstation against `https://galgos.alexlawton.ai`.

Result:

- 11 sampled Gold cases;
- 11 passed;
- pass rate 1.0;
- every sampled response reported 100% paragraph citation-marker coverage;
- citation IDs and rendered markers were valid;
- required evidence-status paragraphs were present;
- citation provenance was inspectable.

This is a system-contract result, not a claim that every cited sentence was historically correct.

## What these evaluations do not prove

They do not automatically prove:

- entailment between every answer sentence and its citation;
- historical correctness of a source;
- independence of apparently separate sources;
- correctness of disputed interpretations;
- ancestry, population continuity or causal relationships.

Those remain governed by corpus evidence classification, source review and human historical research.

## Release use

The evaluation suite is deliberately separate from every Vercel build because embeddings/generation have cost and latency. Run it:

- before material retrieval/ranking changes;
- after major corpus migrations;
- before major public research releases;
- whenever an Ask Archive regression is suspected.

The architectural boundary remains:

**GitHub corpus → Vercel application/evaluation → Vercel-connected Neon**.

No workstation evaluation script requires or authorizes direct Neon connector access.
