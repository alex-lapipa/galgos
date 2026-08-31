# GALGOS Gold Evaluation Contract

## Purpose

The evaluation system protects the public research experience from two different classes of regression:

1. **Retrieval regressions** — the right evidence does not appear, or one long synthesis crowds out independent records.
2. **Answer-contract regressions** — Ask Archive returns malformed citations, missing provenance, weak paragraph citation coverage or loses its explicit evidence-status conclusion.

These checks measure system behavior. They do **not** automatically establish historical truth.

## Gold set

`eval/gold-questions.ts` contains 42 bilingual research questions across:

- classical evidence;
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

Expected path needles mean that at least one relevant canonical/methodological record should appear in the retrieved set. They are recall expectations, not exclusive answers.

## Retrieval evaluator

Run:

`pnpm rag:eval:gold`

Requires the normal Vercel-provided runtime model/database environment when executed against production-equivalent infrastructure.

Measures:

- recall against expected source families;
- average distinct documents in the top ten;
- average source-role diversity;
- worst single-document concentration;
- recall by category.

Current release thresholds:

- overall recall >= 0.85;
- average distinct documents >= 3;
- no single document may exceed 50% of a top-ten result set.

Source-role diversity is reported but is not yet a hard release threshold because some narrow primary-source questions legitimately resolve to one source family.

## Ask contract evaluator

Run:

`GALGOS_BASE_URL=https://<deployment> pnpm ask:eval:contract`

This intentionally runs against a deployed Vercel surface rather than directly against Neon.

It samples the gold set and validates:

- HTTP success;
- every `usedCitationId` exists in the returned citation payload;
- every rendered `[n]` marker resolves to a returned citation;
- paragraph citation coverage is at least 75%;
- the answer includes the required `Evidence status:` / `Estado de la evidencia:` conclusion;
- citations contain path, exact line range, excerpt and source role for inspection.

A 90% contract pass rate is required.

## What these evaluations do not prove

They do not automatically prove:

- entailment between every answer sentence and its citation;
- historical correctness of a source;
- independence of apparently separate sources;
- correctness of disputed interpretations;
- ancestry, population continuity or causal relationships.

Those remain governed by corpus evidence classification, source review and human historical research.

## Release use

The evaluation suite is deliberately separate from every Vercel build because it invokes embeddings/generation and therefore has cost and latency. It should be run:

- before material retrieval/ranking changes;
- after major corpus migrations;
- before major public research releases;
- whenever an Ask Archive regression is suspected.

The architectural boundary remains:

**GitHub corpus -> Vercel application/evaluation -> Vercel-connected Neon**.

No evaluation script requires or authorizes direct Neon connector access.
