BEGIN;
CREATE SCHEMA IF NOT EXISTS galgo;
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
CREATE EXTENSION IF NOT EXISTS lakebase_text CASCADE;
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
CREATE INDEX IF NOT EXISTS chunks_document_idx ON galgo.chunks(document_id, chunk_index);
CREATE INDEX IF NOT EXISTS chunks_embedding_ann_idx ON galgo.chunks USING lakebase_ann (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS chunks_bm25 ON galgo.chunks USING lakebase_bm25 (search_text) WITH (default_limit=50);
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
  chunk_id uuid, document_id uuid, title text, repository_path text,
  heading_path text, line_start integer, line_end integer, chunk_text text,
  semantic_score double precision, lexical_score double precision, score double precision
)
LANGUAGE sql STABLE AS $$
WITH vector_ranked AS (
  SELECT id, RANK() OVER (ORDER BY distance) AS rank, 1 - distance AS similarity
  FROM (
    SELECT c.id, (c.embedding <=> query_embedding)::double precision AS distance
    FROM galgo.chunks c WHERE c.embedding IS NOT NULL
    ORDER BY distance LIMIT GREATEST(match_count * 4, 40)
  ) v
), keyword_ranked AS (
  SELECT id, RANK() OVER (ORDER BY bm25_score) AS rank, bm25_score
  FROM (
    SELECT c.id,
      (c.search_text <@> to_bm25query(to_tsvector('simple', query_text), 'galgo.chunks_bm25'))::double precision AS bm25_score
    FROM galgo.chunks c
    ORDER BY bm25_score LIMIT GREATEST(match_count * 4, 40)
  ) k
), fused AS (
  SELECT COALESCE(v.id,k.id) AS id,
    COALESCE(v.similarity,0)::double precision AS semantic_score,
    COALESCE(k.bm25_score,0)::double precision AS lexical_score,
    (semantic_weight * COALESCE(1.0/(60+v.rank),0) + lexical_weight * COALESCE(1.0/(60+k.rank),0))::double precision AS score
  FROM vector_ranked v FULL OUTER JOIN keyword_ranked k ON k.id=v.id
)
SELECT c.id,c.document_id,d.title,d.repository_path,c.heading_path,c.line_start,c.line_end,
       c.text,f.semantic_score,f.lexical_score,
       (f.score * CASE d.corpus_status WHEN 'canonical' THEN 1.00 WHEN 'methodology' THEN 0.95 ELSE 0.70 END)::double precision AS score
FROM fused f JOIN galgo.chunks c ON c.id=f.id JOIN galgo.documents d ON d.id=c.document_id
ORDER BY score DESC,c.id LIMIT match_count;
$$;
COMMIT;
