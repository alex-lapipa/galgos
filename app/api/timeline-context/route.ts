import { NextRequest, NextResponse } from 'next/server';
import { graphContext, retrieve } from '@/lib/rag';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { title?: string; summary?: string; source?: string };
    const title = body.title?.trim();
    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });

    const query = [title, body.summary, body.source].filter(Boolean).join('\n').slice(0, 5000);
    const chunks = await retrieve(query, 7);
    const labels = [...new Set(chunks.map(chunk => chunk.title).filter(Boolean))];
    const edges = await graphContext(labels, 28);

    return NextResponse.json({
      query: title,
      documents: chunks.map(chunk => ({
        chunkId: chunk.chunk_id,
        documentId: chunk.document_id,
        title: chunk.title,
        repositoryPath: chunk.repository_path,
        heading: chunk.heading_path,
        lineStart: chunk.line_start,
        lineEnd: chunk.line_end,
        excerpt: chunk.chunk_text,
        score: chunk.score,
      })),
      edges,
    });
  } catch (error) {
    console.error('[timeline-context]', error);
    return NextResponse.json({ error: 'Unable to load evidence context' }, { status: 500 });
  }
}
