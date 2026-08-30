---
document_id: "GE-00-05"
title: "Claim Classification Framework"
slug: "claim-classification-framework"
batch: "00"
document_type: "glossary"
language: "en"
source_languages: []
period_start: ""
period_end: ""
geographies: []
entities: []
people: []
dog_types: []
topics: ["evidence classification", "continuity types"]
evidence_level: "unsupported"
source_quality: "tier_1"
created_at: "2026-08-30"
updated_at: "2026-08-30"
version: "1.0"
citation_count: 0
review_status: "draft"
---

# Claim Classification Framework

## Evidence-level categories

| Label | Meaning |
|---|---|
| **Confirmed** | Directly supported by primary or strong scientific evidence (e.g. a dated text explicitly naming the practice/animal, or peer-reviewed genetic/osteological data) |
| **Probable** | Supported by convergent evidence from multiple independent lines, but not definitively demonstrated |
| **Plausible** | Historically possible and consistent with context, but evidence is limited or indirect |
| **Disputed** | Credible scholars/authorities disagree |
| **Traditional claim** | Repeated frequently in breed histories or popular accounts but not independently demonstrated in the scholarly record |
| **Unsupported** | No reliable evidence found for the claim after search |
| **Disproven or materially misleading** | Contradicted by stronger evidence; actively wrong or misleading as usually stated |

Every claims table in this corpus uses exactly these seven labels — no synonyms, no invented intermediate categories — so a RAG system can filter reliably on this field.

## The five continuity dimensions

Historical connections between an ancient/medieval dog and the modern Galgo Español are **never treated as a single yes/no question**. Each is broken into up to five independent claims:

1. **Continuity of function** — was a long-legged dog used for coursing/sighthunting in both periods? (Easiest to support.)
2. **Continuity of morphological type** — does the physical body plan (long limbs, deep chest, lightweight build) persist, as shown by remains, art, or description?
3. **Continuity of population** — is there evidence of an actual breeding-population lineage connecting the two (genetic or documentary), as opposed to independent/convergent selection for the same function?
4. **Continuity of name** — does a cognate term persist, and does the term mean the same thing across periods? (Names can persist while referring to different animals, or types can persist under changing names.)
5. **Continuity of formal breed** — is there an unbroken, documented studbook/standard lineage? (This is only meaningful from the point of formal breed registration onward — 19th–20th century — and must never be projected backward onto antiquity.)

A document may reasonably conclude, e.g., "probable continuity of function and morphological type; unsupported continuity of population; traditional claim of continuity of name; not applicable for continuity of formal breed" — all in the same claims table, for the same historical dog.

## Anti-pattern to avoid

Do not write sentences of the form "the Galgo Español descends directly from the Roman vertragus" without immediately specifying which of the five continuity types is meant and at what evidence level. This sentence, unqualified, is the single most common error in popular breed histories and is explicitly flagged as a **traditional claim** pending stronger evidence in every batch where it recurs.

## Suggested RAG questions

- What are the seven evidence-level labels used in this corpus?
- What is the difference between continuity of function and continuity of population?
- Why is "the galgo descends from the Roman vertragus" flagged as a traditional claim rather than a fact?
