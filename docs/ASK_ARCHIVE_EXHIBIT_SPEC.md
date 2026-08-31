# GALGOS Ask Archive — Research Interface Specification

## Purpose
Turn the GALGOS corpus, RAG and explicit knowledge graph into a professional research interface that answers questions without collapsing uncertainty, disagreement or provenance.

## Primary question
What does the archive actually support about the Galgo Español, and where are the limits of that evidence?

## Product role
Ask Archive is the connective research layer between Timeline, Institutional Graph and Archive. It is not a general-purpose chatbot and must never answer from model memory when the archive evidence is insufficient.

## Evidence contract
- Retrieval is mandatory before generation.
- Generated factual claims must cite supplied archive evidence using numbered citation markers.
- Citations expose title, repository path, heading and exact source line range.
- Canonical, methodology and legacy corpus status remain visible.
- Frontmatter evidence metadata such as `evidence_level`, `review_status` and `source_quality` remain visible when available.
- Similarity, iconography, artistic resemblance or repeated function must not be converted into historical continuity or ancestry.
- Institutional `OPPOSED_TO` edges represent documented positions only; they do not imply symmetric power, evidence quality, morality or causal effect.
- Contested estimates remain contested. Different data-generating systems must not be flattened into a single factual number.
- If retrieved evidence is insufficient, contradictory or methodologically incomparable, the answer must say so explicitly.

## Answer architecture
1. Direct answer — concise synthesis supported by citations.
2. Evidence status — a short explicit statement of how strong or limited the retrieved basis is.
3. Source cards — cited passages and provenance, prioritizing actually cited evidence.
4. Related graph context — only explicit graph relationships tied to entities named in the question.
5. Continue research — contextual links to Timeline, Institutional Graph and Archive plus suggested follow-up questions.

## Bilingual behavior
- English and Spanish interface copy.
- User can switch language without losing the current question.
- Generated answer follows the selected interface language, while canonical entity names and source titles remain unchanged.
- Source excerpts remain in their corpus language; do not silently translate quotations or source text.

## Evidence-status semantics
- `confirmed`: directly supported by strong evidence in the corpus.
- `probable`: supported but not conclusive.
- `plausible`: interpretation is reasonable but evidence is incomplete.
- `disputed`: material conflict exists between sources or interpretations.
- `traditional`: inherited narrative or cultural tradition, not equivalent to proof.
- `unsupported`: corpus does not establish the claim.
- `disproven`: corpus contains evidence against the claim.
- Unknown remains `unverified`.

## Visual / interaction system
- Preserve GALGO/7 digital design language: dark editorial research surface, Fraunces + Geist + DM Mono, restrained spectrum accents and glass panels.
- Answer is the primary exhibit; provenance is visually secondary but always available.
- Citation markers in the answer correspond exactly to numbered evidence cards.
- Do not visualize retrieval score as truth probability.
- Avoid decorative chat bubbles; use a research-notebook / evidence-console model.
- Maintain accessible contrast, keyboard navigation, readable source cards and mobile reflow.

## Suggested research prompts
Prompts should teach the archive's capabilities and surface important methodological distinctions, for example:
- What is the earliest secure evidence for galgo-type dogs in Iberia?
- What does the archive actually establish about Roman-era continuity?
- How did the social role of the galgo change from medieval law to modern coursing?
- What does Yo Galgo document, and what impact can be supported without overstating causality?
- What are the documented institutional relationships around Ley 7/2023?
- What do competing abandonment estimates measure, and why are they not directly comparable?

## QA gates
- No answer without retrieval.
- No citation marker without a corresponding source card.
- No source card invented outside retrieval results.
- Archive source paths and line ranges remain exact.
- Evidence metadata is taken from corpus frontmatter, not inferred by the model.
- Graph relationships shown are explicit stored graph edges only.
- Model name and embedding model may be disclosed in technical metadata but never treated as evidence quality.
- Works with `?q=` deep links from Timeline and Institutional Graph.
- Responsive at 390, 768, 1280 and 1600 px.
