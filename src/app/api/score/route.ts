import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ok, fail, wrap } from '@/utils/api';
import { assertRateLimit } from '@/middleware/rateLimit';
import { logRequest } from '@/middleware/log';

type Mode = 'word' | 'char';

function tokenizeWords(s: string) {
  return s
    .toLowerCase()
    .replace(/[.,!?;:()"„“‚’]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function levenshtein(a: string[] | string, b: string[] | string) {
  const A = Array.isArray(a) ? a : Array.from(a);
  const B = Array.isArray(b) ? b : Array.from(b);
  const dp: number[][] = Array(A.length + 1)
    .fill(0)
    .map(() => Array(B.length + 1).fill(0));
  for (let i = 0; i <= A.length; i++) {
    dp[i]![0] = i;
  }
  for (let j = 0; j <= B.length; j++) {
    dp[0]![j] = j;
  }
  for (let i = 1; i <= A.length; i++) {
    for (let j = 1; j <= B.length; j++) {
      const cost = A[i - 1] === B[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1, // deletion
        dp[i]![j - 1]! + 1, // insertion
        dp[i - 1]![j - 1]! + cost // substitution
      );
    }
  }
  return dp[A.length]![B.length]!;
}

async function handler(req: NextRequest): Promise<NextResponse> {
  const start = Date.now();
  assertRateLimit(req, '/api/score');

  let body: { transcript?: string; reference?: string; mode?: Mode };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    logRequest(req, '/api/score', Date.now() - start);
    return fail(400, 'invalid_body');
  }

  const transcript = typeof body.transcript === 'string' ? body.transcript.trim() : '';
  const reference = typeof body.reference === 'string' ? body.reference.trim() : '';
  const mode: Mode = body.mode === 'char' ? 'char' : 'word';

  if (!transcript || !reference) {
    logRequest(req, '/api/score', Date.now() - start);
    return fail(400, 'missing_params');
  }

  if (transcript.length > 200 || reference.length > 200) {
    logRequest(req, '/api/score', Date.now() - start);
    return fail(400, 'text_too_long');
  }

  let errorRate = 1;
  let wer: number | undefined;
  let cer: number | undefined;
  let refTokens: number | undefined;
  let hypTokens: number | undefined;

  if (mode === 'word') {
    const ref = tokenizeWords(reference);
    const hyp = tokenizeWords(transcript);
    refTokens = ref.length;
    hypTokens = hyp.length;
    const dist = levenshtein(ref, hyp);
    wer = ref.length ? dist / ref.length : 1;
    errorRate = wer;
  } else {
    const ref = reference.toLowerCase();
    const hyp = transcript.toLowerCase();
    const dist = levenshtein(ref, hyp);
    cer = ref.length ? dist / ref.length : 1;
    errorRate = cer;
  }

  const score = Math.max(0, Math.min(100, Math.round((1 - errorRate) * 100)));

  const tips: string[] = [];
  if (score < 85) tips.push('Sprich etwas langsamer.');
  if (score < 70) tips.push('Achte auf Artikel und Endungen.');

  const metrics: {
    mode: Mode;
    wer?: number;
    cer?: number;
    refTokens?: number;
    hypTokens?: number;
  } = {
    mode,
    ...(wer !== undefined ? { wer } : {}),
    ...(cer !== undefined ? { cer } : {}),
    ...(refTokens !== undefined ? { refTokens } : {}),
    ...(hypTokens !== undefined ? { hypTokens } : {}),
  };

  const response = ok({ score, tips: tips.slice(0, 2), metrics });
  logRequest(req, '/api/score', Date.now() - start);
  return response;
}

export const POST = wrap(handler, '/api/score');
