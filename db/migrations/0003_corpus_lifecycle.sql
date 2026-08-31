BEGIN;

ALTER TABLE galgo.documents
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS retired_at timestamptz;

CREATE INDEX IF NOT EXISTS documents_active_idx
  ON galgo.documents(active, corpus_status);

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
    FROM galgo.chunks c
    JOIN galgo.documents d ON d.id=c.document_id
    WHERE c.embedding IS NOT NULL AND d.active = true
    ORDER BY distance LIMIT GREATEST(match_count * 4, 40)
  ) v
), keyword_ranked AS (
  SELECT id, RANK() OVER (ORDER BY bm25_score) AS rank, bm25_score
  FROM (
    SELECT c.id,
      (c.search_text <@> to_bm25query(to_tsvector('simple', query_text), 'galgo.chunks_bm25'))::double precision AS bm25_score
    FROM galgo.chunks c
    JOIN galgo.documents d ON d.id=c.document_id
    WHERE d.active = true
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
FROM fused f
JOIN galgo.chunks c ON c.id=f.id
JOIN galgo.documents d ON d.id=c.document_id
WHERE d.active = true
ORDER BY score DESC,c.id LIMIT match_count;
$$;

COMMIT;
