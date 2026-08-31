---
document_id: "GE-00-AUDIT-2026-01"
title: "Corpus Gaps and Verification Audit — 31 August 2026"
slug: "corpus-gaps-verification-audit-2026"
batch: "00"
document_type: "corpus_audit"
language: "en"
source_languages: ["en", "es", "la"]
period_start: ""
period_end: "2026"
geographies: ["Spain", "Iberian Peninsula"]
dog_types: ["galgo", "sighthound", "lebrel", "hunting dog"]
topics: ["corpus status", "research gaps", "verification", "primary sources", "provenance"]
entities: ["GALGOS corpus"]
people: []
evidence_level: "confirmed"
source_quality: "internal_corpus_audit"
created_at: "2026-08-31"
updated_at: "2026-08-31"
version: "1.0"
review_status: "verified-against-repository"
---

# Corpus Gaps and Verification Audit — 31 August 2026

## Purpose

This audit describes the **current repository state**, not an idealized research plan. It exists because early project planning documents and later delivered files no longer agree on batch status. The repository itself is the authority for whether a file is present; presence does not mean every claim inside that file is independently verified.

## 1. Current high-level corpus state

As of 31 August 2026 the repository contains:

- Batch 00 methodology/framework records;
- enriched chronological files for Batches 09–13;
- Batch 14 synthesis/compilation;
- dedicated canonical records for the institutional landscape and *Yo Galgo*;
- legacy/source research records used by the RAG ingestion layer;
- Batch 15 primary-source archival roadmap;
- Batch 16 visual/material-culture atlas methodology and anchor records.

The historical `00_research_ledger.md` still reflects an earlier planning state and must not be read as an accurate live inventory without this audit.

## 2. Earlier-period coverage

The upload manifest states that Batches 01–08 were delivered in prior commits, but files using straightforward `Batch_01`–`Batch_08` names are not visible in the present top-level repository inventory. Earlier-period research may survive in legacy/source records and inside the Batch 14 synthesis, but this is **not equivalent to having clean canonical batch files for each period**.

Therefore the current status is:

- **historical subject coverage:** present in synthesis/source material;
- **clean canonical period-by-period source records:** incomplete / requires reconciliation;
- **primary-source verification:** uneven by period.

## 3. Highest-priority verification gaps

### Medieval law and fueros

Recurring statements about the Fuero de Salamanca, Fuero de Coria and other medieval legal treatment of galgos must be tied to exact manuscript/edition provisions. Until exact text, witness and folio/page are established, the strongest formulation should remain qualified.

### Classical ancestry

Arrian's *Cynegeticus* is strong evidence for Celtic coursing dogs and hare pursuit. It is not direct evidence that a Roman-period *vertragus* is the biological ancestor of the modern Galgo Español.

Any synthesis sentence that moves from analogous function/morphology to breed descent must be treated as inference, not direct evidence.

### Al-Andalus / North-African influence

Evidence for hunting traditions and sighthound types is not automatically evidence for a population-level Sloughi-to-Galgo ancestry event. Documentary, osteometric or genomic support must be kept separate.

### Name continuity

The linguistic history of `galgo`, `galga`, `lebrel`, Latin terms and proposed Celtic/Gaulish etymologies requires witness-level philological verification. Similar-looking words across centuries are not by themselves evidence of uninterrupted breed identity.

### 20th-century crossings

The corpus contains substantial evidence for English Greyhound influence and crossing in racing contexts. The scale and persistence of that ancestry in present Galgo Español populations require careful population-genomic interpretation and should not be inferred from historical breeding anecdotes alone.

### Abandonment statistics

The 50,000–100,000 annual galgo abandonment range remains contested. Different NGO estimates, SEPRONA-derived figures, protectora surveys and Fundación Affinity studies use different data-generating systems and denominators. The corpus must not merge them into a single national statistic.

## 4. Synthesis-document caution

`Batch_14_Synthesis_and_Compilation.md` is valuable as a narrative integration layer, but it is a **secondary synthesis inside this corpus**. Its statements should be resolved back to source records before being displayed as high-confidence standalone facts.

In particular, labels such as `probable continuity spanning at least 2,000 years`, `name continuity`, or statements that medieval evidence is `confirmed` should be interpreted through the five-continuity framework and their cited primary evidence—not accepted merely because the synthesis repeats them.

## 5. Canonicalization priorities

### Priority A — recover/rebuild canonical Batches 01–08

Create clean source-mapped canonical records for:

1. deep prehistory / archaeological context;
2. pre-Roman Iberia and Celtic-context claims;
3. Greece and Rome;
4. Late Antiquity / Visigothic period;
5. Al-Andalus / North Africa;
6. medieval fueros and law;
7. medieval literature / hunting manuals;
8. 1450–1700 early-modern Spain.

Each record should preserve disagreements rather than silently resolving them.

### Priority B — primary-source objects

Ingest exact archival/museum records as independent documents rather than only citing them inside broad batch prose:

- individual fueros / legal provisions;
- historical newspaper articles;
- named-dog competition records;
- FCI/RSCE standards;
- paintings/frescoes/object records;
- legislative texts;
- genomic papers and methodological notes.

### Priority C — explicit claim ledger

Move high-risk claims into an auditable claim register with:

- claim ID;
- exact wording;
- continuity dimension;
- evidence level;
- supporting source IDs;
- contradicting source IDs;
- review status;
- unresolved question.

## 6. Interface implications

GALGOS should expose at least three different things to the reader:

1. **Source record** — what a document/object itself establishes.
2. **Synthesis** — how the project currently integrates multiple records.
3. **Open question** — what remains unresolved or requires archival work.

These should not be visually styled as if they were interchangeable.

## 7. Current next-phase programme

The immediate additive programme is:

- Batch 15: primary-source archival roadmap;
- Batch 16: visual/material evidence atlas;
- rebuild canonical early-period records from source evidence;
- continue object-level ingestion through the Vercel production ingestion path into the Vercel-connected Neon database;
- keep the site mobile-first and make provenance visible at the moment a claim is encountered.

## Governance note

Neon is part of the GALGOS runtime/storage architecture through Vercel. This audit does not require or authorize direct database-connector edits. Corpus additions enter the database through the existing Vercel production build/ingestion workflow.
