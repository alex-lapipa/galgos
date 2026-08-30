# Galgo Español Retrieval Architecture

## Principles
- GitHub Markdown is the canonical research source; Neon is a derived retrieval index.
- Every retrieved passage preserves repository path and line provenance.
- Semantic similarity never upgrades a historical claim's evidence status.
- Graph edges are created only from explicit corpus metadata or reviewed extraction.
- Re-ingestion is deterministic and keyed by document/content hashes.

## Storage
- `galgo.documents`: canonical document snapshots and frontmatter.
- `galgo.chunks`: section-aware text chunks, Lakebase BM25 search and 1536d vectors.
- `galgo.graph_nodes`: document, topic, geography, period, person, entity, dog type and language nodes.
- `galgo.graph_edges`: provenance-bearing relationships from documents to explicit metadata nodes.
- `galgo.ingestion_runs`: audit trail for every indexing run.

## Retrieval
`galgo.hybrid_search` uses reciprocal-rank fusion over Lakebase ANN cosine similarity and Lakebase BM25 keyword search. The default weighting is 70% semantic / 30% lexical. `app/api/ask` then sends only retrieved passages to the generation model and returns path/line citations.

## Models
- Embeddings: `openai/text-embedding-3-small` through Vercel AI Gateway/OIDC, 1536 dimensions.
- Generation: `openai/gpt-5.6-sol` through Vercel AI Gateway/OIDC; override with `RAG_GENERATION_MODEL`.

## Governance
The database is disposable and reproducible from Git. No generated answer becomes canonical research unless it is written back through the research-review workflow with sources and evidence classification.
