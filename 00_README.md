---
document_id: "GE-00-01"
title: "README — Galgo Español Research Corpus"
slug: "readme"
batch: "00"
document_type: "timeline"
language: "en"
source_languages: []
period_start: ""
period_end: ""
geographies: ["Iberian Peninsula"]
entities: ["Galgo Español"]
people: []
dog_types: ["galgo", "sighthound"]
topics: ["project overview", "corpus structure"]
evidence_level: "unsupported"
source_quality: "tier_1"
created_at: "2026-08-30"
updated_at: "2026-08-30"
version: "1.0"
citation_count: 0
review_status: "draft"
---

# README — Galgo Español Research Corpus

## Purpose

This corpus documents the history of the Galgo Español — its probable ancestral populations, the archaeological and textual record of Iberian coursing dogs, and the dog's changing social role from prehistory to the present. It is built for ingestion into a retrieval-augmented generation (RAG) system, so each file is self-contained, individually cited, and tagged with structured metadata.

## Governing principle

**No unbroken pedigree is assumed.** A modern, closed-studbook breed (formalized in the 20th century) is not the same object as a medieval *lebrel*, a Roman *vertragus*, or a Bronze Age long-legged dog. Every historical connection is explicitly classified — Confirmed, Probable, Plausible, Disputed, Traditional claim, Unsupported, or Disproven or materially misleading — per `00_claim_classification_framework.md`. Five distinct kinds of continuity (function, morphological type, population, name, formal breed) are tracked separately rather than conflated.

## How the corpus is organized

| Batch | Scope |
|---|---|
| 00 | Methodology, source hierarchy, terminology, classification framework, ledger (this batch) |
| 01 | Deep prehistory and ancient sighthound context |
| 02 | Celts, Iberians, and pre-Roman Europe |
| 03 | Greece and Rome |
| 04 | Late Antiquity and the Visigothic period |
| 05 | Al-Andalus and North African connections |
| 06 | Medieval fueros and law |
| 07 | Medieval literature and hunting manuals |
| 08 | 1450–1700 |
| 09 | 1700–1900 |
| 10 | 1900–2000 |
| 11 | 2000–present |
| 12 | Science of origin and continuity |
| 13 | Synthesis |

## File-naming convention

`GE-[BATCH]-[NUMBER]_short-slug.md`, e.g. `GE-01-02_prehistoric-iberian-dogs.md`.

## Status of this project

Work proceeds one batch at a time, with a progress report and file delivery after each batch, per the research brief. See `00_research_ledger.md` for live status.

## Scope limitation (read before citing this corpus)

This research was conducted by an AI system using web search and publicly accessible digital repositories. It is **not** equivalent to original archival paleography or laboratory genetic analysis. Where a claim would require physical manuscript inspection, unpublished excavation data, or new osteometric/genomic work, this is flagged in the relevant file's "Evidential limitations" section rather than asserted as settled.

## Suggested RAG questions

- What batches make up the Galgo Español research corpus and what does each cover?
- What is the corpus's policy on claiming ancestry for the Galgo Español?
- What are the five kinds of continuity distinguished in this research?
