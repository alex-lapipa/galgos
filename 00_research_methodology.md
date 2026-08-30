---
document_id: "GE-00-02"
title: "Research Methodology"
slug: "research-methodology"
batch: "00"
document_type: "period_synthesis"
language: "en"
source_languages: ["en", "es", "la", "grc", "fr", "pt", "it", "de", "ar", "ca", "gl"]
period_start: ""
period_end: ""
geographies: ["Iberian Peninsula", "Mediterranean", "North Africa", "Northern Europe"]
entities: []
people: []
dog_types: ["galgo", "sighthound", "lebrel", "vertragus"]
topics: ["methodology", "verification standards", "AI research limitations"]
evidence_level: "unsupported"
source_quality: "tier_1"
created_at: "2026-08-30"
updated_at: "2026-08-30"
version: "1.0"
citation_count: 0
review_status: "draft"
---

# Research Methodology

## Executive summary

This document defines how each batch is researched, verified, and written up, so that every downstream file follows a consistent evidentiary standard and its limitations are legible to anyone using the corpus later — including a RAG system that cannot itself judge source quality.

## Method

1. **Query design per subtopic.** For each subtopic in a batch, searches are run in multiple languages (see `00_search_terms_multilingual.md`), using both modern and historical spellings.
2. **Source triage.** Every source found is provisionally sorted into Tier 1–4 (`00_source_hierarchy.md`). Tier 4 sources (newspapers, blogs, breed sites, Wikipedia) are used only to locate leads, never as sole support for a historical claim.
3. **Primary-text handling.** Where a primary text is available in digitized form (Perseus, PARES, BDH, Cervantes Virtual, etc.), the original-language passage is located, quoted only briefly (respecting copyright and the corpus's own citation limits), and given a working English translation, clearly marked as a working translation rather than a published critical one unless a specific published translation is cited.
4. **Claim classification.** Every substantive historical claim is assigned one of the seven evidence levels in `00_claim_classification_framework.md`, with reasoning.
5. **Cross-checking.** Where possible, at least two independent sources are sought for non-trivial claims. Single-source claims are marked as such.
6. **Negative results are recorded.** If a widely repeated claim (e.g. a specific fuero provision, or a supposed classical reference) cannot be located in a form that supports it, this is recorded explicitly as "traditional claim, unverified" or "unsupported" rather than silently omitted or silently repeated.

## What this methodology can and cannot establish

**Can do reasonably well:**
- Synthesize published scholarship (journal articles, monographs, theses) on dog domestication, archaeozoology, medieval Iberian law and literature, and breed history.
- Locate and quote digitized primary texts (classical authors on Perseus/Loeb where accessible; medieval Castilian legal and literary texts on BDH/Cervantes Virtual/CORDE).
- Track how scholarly and institutional consensus has described the galgo's ancestry and social role over time.

**Cannot do:**
- Conduct new archival paleography (reading unscanned manuscripts, verifying folio numbers against physical documents).
- Perform new osteometric or ancient-DNA analysis; the corpus can only report what published studies say.
- Guarantee that every digitized source's OCR is error-free; uncertain readings are marked `[unclear]` and cross-checked against a second source where feasible, but this is not equivalent to in-person manuscript collation.
- Access paywalled, authenticated, or robots.txt-restricted material.

This limitation is restated in each batch's "Evidential limitations" sections rather than buried once here.

## Sources

- Methodology follows the structure specified in the project's own research brief (2026).

## Suggested RAG questions

- What are the limits of this research corpus's evidentiary methods?
- How does this project handle claims it cannot verify?
