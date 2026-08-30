BEGIN;
CREATE SCHEMA IF NOT EXISTS galgo;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS galgo.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_key text NOT NULL UNIQUE,
  repository_path text NOT NULL UNIQUE,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  corpus_status text NOT NULL CHECK (corpus_status IN ('canonical','legacy','methodology')),
  content_hash text NOT NULL,
  git_sha text NOT NULL,
  frontmatter jsonb NOT NULL DEFAULT '{}'::jsonb,
  markdown text NOT NULL,
  search_text tsvector GENERATED ALWAYS AS (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(markdown,''))) STORED,
  ingested_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS galgo.chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES galgo.documents(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL,
  heading_path text NOT NULL DEFAULT '',
  line_start integer NOT NULL,
  line_end integer NOT NULL,
  text text NOT NULL,
  content_hash text NOT NULL,
  embedding vector(1536),
  embedding_model text,
  token_estimate integer,
  search_text tsvector GENERATED ALWAYS AS (to_tsvector('simple', coalesce(heading_path,'') || ' ' || text)) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(document_id, chunk_index, content_hash)
);

CREATE TABLE IF NOT EXISTS galgo.graph_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_key text NOT NULL UNIQUE,
  node_type text NOT NULL,
  label text NOT NULL,
  normalized_label text NOT NULL,
  properties jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS galgo.graph_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_node_id uuid NOT NULL REFERENCES galgo.graph_nodes(id) ON DELETE CASCADE,
  edge_type text NOT NULL,
  target_node_id uuid NOT NULL REFERENCES galgo.graph_nodes(id) ON DELETE CASCADE,
  document_id uuid REFERENCES galgo.documents(id) ON DELETE CASCADE,
  chunk_id uuid REFERENCES galgo.chunks(id) ON DELETE SET NULL,
  provenance jsonb NOT NULL DEFAULT '{}'::jsonb,
  confidence numeric(4,3) NOT NULL DEFAULT 1.000 CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_node_id, edge_type, target_node_id, document_id)
);

CREATE TABLE IF NOT EXISTS galgo.ingestion_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  git_sha text NOT NULL,
  embedding_model text NOT NULL,
  parser_version text NOT NULL,
  documents integer NOT NULL DEFAULT 0,
  chunks integer NOT NULL DEFAULT 0,
  embedded_chunks integer NOT NULL DEFAULT 0,
  graph_nodes integer NOT NULL DEFAULT 0,
  graph_edges integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'running',
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS documents_search_idx ON galgo.documents USING gin(search_text);
CREATE INDEX IF NOT EXISTS chunks_search_idx ON galgo.chunks USING gin(search_text);
CREATE INDEX IF NOT EXISTS chunks_document_idx ON galgo.chunks(document_id, chunk_index);
CREATE INDEX IF NOT EXISTS chunks_embedding_hnsw_idx ON galgo.chunks USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);
CREATE INDEX IF NOT EXISTS graph_nodes_type_idx ON galgo.graph_nodes(node_type);
CREATE INDEX IF NOT EXISTS graph_nodes_label_trgm_idx ON galgo.graph_nodes USING gin(normalized_label gin_trgm_ops);
CREATE INDEX IF NOT EXISTS graph_edges_source_idx ON galgo.graph_edges(source_node_id, edge_type);
CREATE INDEX IF NOT EXISTS graph_edges_target_idx ON galgo.graph_edges(target_node_id, edge_type);

CREATE OR REPLACE FUNCTION galgo.hybrid_search(
  query_text text,
  query_embedding vector(1536),
  match_count integer DEFAULT 12,
  semantic_weight double precision DEFAULT 0.70,
  lexical_weight double precision DEFAULT 0.30
)
RETURNS TABLE(
  chunk_id uuid,
  document_id uuid,
  title text,
  repository_path text,
  heading_path text,
  line_start integer,
  line_end integer,
  chunk_text text,
  semantic_score double precision,
  lexical_score double precision,
  score double precision
)
LANGUAGE sql STABLE AS $$
WITH semantic AS (
  SELECT c.id, row_number() OVER (ORDER BY c.embedding <=> query_embedding) AS rank,
         GREATEST(0, 1 - (c.embedding <=> query_embedding))::double precision AS sim
  FROM galgo.chunks c
  WHERE c.embedding IS NOT NULL
  ORDER BY c.embedding <=> query_embedding
  LIMIT GREATEST(match_count * 4, 40)
), lexical AS (
  SELECT c.id, row_number() OVER (ORDER BY ts_rank_cd(c.search_text, websearch_to_tsquery('simple', query_text)) DESC) AS rank,
         ts_rank_cd(c.search_text, websearch_to_tsquery('simple', query_text))::double precision AS lex
  FROM galgo.chunks c
  WHERE c.search_text @@ websearch_to_tsquery('simple', query_text)
  ORDER BY lex DESC
  LIMIT GREATEST(match_count * 4, 40)
), fused AS (
  SELECT COALESCE(s.id,l.id) AS id,
         COALESCE(s.sim,0)::double precision AS semantic_score,
         COALESCE(l.lex,0)::double precision AS lexical_score,
         (semantic_weight * COALESCE(1.0/(60+s.rank),0) + lexical_weight * COALESCE(1.0/(60+l.rank),0))::double precision AS score
  FROM semantic s FULL OUTER JOIN lexical l ON l.id=s.id
)
SELECT c.id, c.document_id, d.title, d.repository_path, c.heading_path, c.line_start, c.line_end,
       c.text, f.semantic_score, f.lexical_score, f.score
FROM fused f
JOIN galgo.chunks c ON c.id=f.id
JOIN galgo.documents d ON d.id=c.document_id
ORDER BY f.score DESC
LIMIT match_count;
$$;
COMMIT;
