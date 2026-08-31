import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Pool } from '@neondatabase/serverless';

const LOCK_KEY = 'galgos-production-bootstrap-v1';
const MIN_DOCUMENTS = 34;
const MIN_CHUNKS = 559;
const MIN_GRAPH_NODES = 170;
const MIN_GRAPH_EDGES = 194;

async function main() {
  const environment = process.env.VERCEL_ENV;
  if (environment !== 'production') {
    console.log(`[release] database bootstrap skipped in ${environment ?? 'local'} environment`);
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required for production bootstrap');

  const gitSha = process.env.VERCEL_GIT_COMMIT_SHA || 'unknown';
  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();
  let locked = false;

  try {
    const lock = await client.query<{ locked: boolean }>(
      'SELECT pg_try_advisory_lock(hashtext($1)) AS locked',
      [LOCK_KEY],
    );
    locked = Boolean(lock.rows[0]?.locked);
    if (!locked) throw new Error('Another GALGOS production bootstrap is already running');

    const migrationPath = path.join(process.cwd(), 'db', 'migrations', '0002_rag_vector_graph.sql');
    const migrationSql = await readFile(migrationPath, 'utf8');
    await client.query(migrationSql);

    const existing = await client.query<{ id: string }>(
      `SELECT id::text
         FROM galgo.ingestion_runs
        WHERE git_sha = $1 AND status = 'completed'
        ORDER BY completed_at DESC
        LIMIT 1`,
      [gitSha],
    );

    if (existing.rowCount === 0) {
      const tsx = path.join(process.cwd(), 'node_modules', '.bin', 'tsx');
      execFileSync(tsx, ['scripts/ingest-rag.ts'], {
        cwd: process.cwd(),
        env: process.env,
        stdio: 'inherit',
      });
    } else {
      console.log(`[release] ingestion already completed for ${gitSha.slice(0, 12)}`);
    }

    const run = await client.query<{
      documents: number;
      chunks: number;
      embedded_chunks: number;
      graph_nodes: number;
      graph_edges: number;
      status: string;
    }>(
      `SELECT documents, chunks, embedded_chunks, graph_nodes, graph_edges, status
         FROM galgo.ingestion_runs
        WHERE git_sha = $1
        ORDER BY completed_at DESC NULLS LAST
        LIMIT 1`,
      [gitSha],
    );

    if (!run.rows[0] || run.rows[0].status !== 'completed') {
      throw new Error('Production ingestion did not complete successfully');
    }

    const integrity = await client.query<{
      documents: number;
      chunks: number;
      embedded: number;
      graph_nodes: number;
      graph_edges: number;
    }>(
      `SELECT
         (SELECT count(*)::int FROM galgo.documents) AS documents,
         (SELECT count(*)::int FROM galgo.chunks) AS chunks,
         (SELECT count(*)::int FROM galgo.chunks WHERE embedding IS NOT NULL) AS embedded,
         (SELECT count(*)::int FROM galgo.graph_nodes) AS graph_nodes,
         (SELECT count(*)::int FROM galgo.graph_edges) AS graph_edges`,
    );

    const currentRun = run.rows[0];
    const totals = integrity.rows[0];
    if (Number(currentRun.documents) < MIN_DOCUMENTS) {
      throw new Error(`Expected at least ${MIN_DOCUMENTS} ingested documents, found ${currentRun.documents}`);
    }
    if (Number(currentRun.chunks) < MIN_CHUNKS || Number(currentRun.embedded_chunks) !== Number(currentRun.chunks)) {
      throw new Error(`Chunk integrity failed: ${currentRun.embedded_chunks}/${currentRun.chunks} chunks embedded`);
    }
    if (Number(totals.embedded) !== Number(totals.chunks)) {
      throw new Error(`Embedding integrity failed: ${totals.embedded}/${totals.chunks} chunks embedded`);
    }
    if (Number(totals.graph_nodes) < MIN_GRAPH_NODES || Number(totals.graph_edges) < MIN_GRAPH_EDGES) {
      throw new Error(`Knowledge graph integrity failed: ${totals.graph_nodes} nodes / ${totals.graph_edges} edges`);
    }

    console.log(JSON.stringify({
      productionBootstrap: 'ready',
      gitSha: gitSha.slice(0, 12),
      documents: totals.documents,
      chunks: totals.chunks,
      embedded: totals.embedded,
      graphNodes: totals.graph_nodes,
      graphEdges: totals.graph_edges,
    }, null, 2));
  } finally {
    if (locked) {
      await client.query('SELECT pg_advisory_unlock(hashtext($1))', [LOCK_KEY]).catch(() => undefined);
    }
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('[release] production bootstrap failed:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
