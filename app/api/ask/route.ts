import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { graphContext, retrieve } from '@/lib/rag';
import { listCorpus } from '@/lib/corpus';
import { institutionalNodes } from '@/lib/institutional-map';

export const runtime = 'nodejs';

const request = z.object({
  question: z.string().min(3).max(1600),
  locale: z.enum(['en','es']).default('en'),
});
const GENERATION_MODEL = process.env.RAG_GENERATION_MODEL || 'openai/gpt-5.6-sol';

function cleanMeta(value: unknown) {
  if (value === undefined || value === null || value === '') return null;
  return Array.isArray(value) ? value.map(String).join(', ') : String(value);
}

export async function POST(req: Request) {
  const parsed = request.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'A research question is required.' }, { status: 400 });

  try {
    const { question, locale } = parsed.data;
    const [chunks, corpus] = await Promise.all([retrieve(question, 12), listCorpus()]);
    if (!chunks.length) {
      return NextResponse.json({
        answer: locale === 'es'
          ? 'El archivo no contiene evidencia suficiente para responder a esa pregunta.'
          : 'The archive does not contain enough evidence to answer that question.',
        citations: [], graph: [], retrieved: 0, usedCitationIds: [],
      });
    }

    const byPath = new Map(corpus.map(doc => [doc.path, doc]));
    const enriched = chunks.map((chunk, index) => {
      const doc = byPath.get(chunk.repository_path);
      const fm = doc?.frontmatter ?? {};
      return {
        id: index + 1,
        ...chunk,
        slug: doc?.slug ?? null,
        corpusStatus: doc?.status ?? 'unverified',
        evidenceLevel: cleanMeta(fm.evidence_level) ?? 'unverified',
        reviewStatus: cleanMeta(fm.review_status),
        sourceQuality: cleanMeta(fm.source_quality),
        documentType: cleanMeta(fm.document_type),
      };
    });

    const evidence = enriched.map(c =>
      `[${c.id}] ${c.repository_path}:${c.line_start}-${c.line_end}\n` +
      `TITLE: ${c.title}\nHEADING: ${c.heading_path || '—'}\n` +
      `CORPUS_STATUS: ${c.corpusStatus}\nEVIDENCE_LEVEL: ${c.evidenceLevel}\n` +
      `REVIEW_STATUS: ${c.reviewStatus ?? '—'}\nSOURCE_QUALITY: ${c.sourceQuality ?? '—'}\n` +
      `${c.chunk_text}`
    ).join('\n\n');

    const explicitLabels = institutionalNodes
      .filter(node => question.toLowerCase().includes(node.label.toLowerCase()))
      .map(node => node.label)
      .slice(0, 8);
    const graph = explicitLabels.length ? await graphContext(explicitLabels, 16) : [];

    const languageInstruction = locale === 'es'
      ? 'Responde en español de España. Conserva sin traducir los nombres canónicos de entidades, títulos de fuentes y marcadores de cita.'
      : 'Answer in English. Preserve canonical entity names, source titles and citation markers.';

    const { text } = await generateText({
      model: GENERATION_MODEL,
      prompt: `You are Ask Archive, the evidence research interface for the Galgo Español historical archive.\n${languageInstruction}\n\nNON-NEGOTIABLE EVIDENCE RULES:\n- Answer ONLY from the supplied archive evidence. Do not use model memory to fill gaps.\n- Cite every material factual claim with one or more [n] markers corresponding exactly to the supplied evidence.\n- Distinguish direct evidence from inference, tradition, disputed claims, unsupported ancestry claims and methodological gaps.\n- Never convert visual similarity, repeated function, iconography or retrieval similarity into biological or historical continuity.\n- Never flatten methodologically different abandonment estimates into one factual number.\n- If sources disagree or measure different things, state the disagreement or incomparability explicitly.\n- Institutional opposition describes documented position only; do not infer equal power, evidence quality, moral equivalence or causality.\n- Evidence metadata supplied below is archival metadata. Do not upgrade it.\n- If the evidence is insufficient, say exactly what cannot be established.\n\nANSWER FORMAT:\nWrite a clear research answer in 3–8 short paragraphs. Start with the direct answer. End with a short paragraph beginning exactly "Evidence status:" in English or "Estado de la evidencia:" in Spanish, summarizing the strength/limits of the retrieved basis. Do not add a bibliography; the interface renders source cards separately.\n\nQUESTION:\n${question}\n\nARCHIVE EVIDENCE:\n${evidence}`,
    });

    const safeText = text.replace(/\[(\d+)\]/g, (full, raw) => {
      const id = Number(raw);
      return id >= 1 && id <= enriched.length ? full : '';
    });
    const usedCitationIds = [...new Set(Array.from(safeText.matchAll(/\[(\d+)\]/g), m => Number(m[1])))];

    const citations = enriched.map(c => ({
      id: c.id,
      title: c.title,
      path: c.repository_path,
      slug: c.slug,
      heading: c.heading_path,
      lines: [c.line_start, c.line_end],
      score: c.score,
      corpusStatus: c.corpusStatus,
      evidenceLevel: c.evidenceLevel,
      reviewStatus: c.reviewStatus,
      sourceQuality: c.sourceQuality,
      documentType: c.documentType,
      excerpt: c.chunk_text,
      used: usedCitationIds.includes(c.id),
    }));

    return NextResponse.json({
      answer: safeText,
      citations,
      graph,
      retrieved: chunks.length,
      usedCitationIds,
      matchedGraphLabels: explicitLabels,
      models: { embedding: 'openai/text-embedding-3-small', generation: GENERATION_MODEL },
    });
  } catch (error) {
    console.error('ask archive failed', error);
    return NextResponse.json({ error: 'Archive retrieval is temporarily unavailable.' }, { status: 503 });
  }
}
