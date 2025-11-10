import { NextRequest } from 'next/server';
import { ok, fail, wrap } from '@/utils/api';
import { assertRateLimit } from '@/middleware/rateLimit';
import { logRequest } from '@/middleware/log';

export const runtime = 'nodejs';

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = new Set([
  'audio/webm',
  'audio/wav',
  'audio/mpeg',
  'audio/mp4',
  'audio/ogg',
]);

export const POST = wrap(async (req: NextRequest) => {
  const t0 = Date.now();
  assertRateLimit(req, '/api/stt');

  const form = await req.formData();
  const audio = form.get('audio') as File | null;
  const lang = ((form.get('lang') as string) || 'de').trim();
  if (!audio) return fail(400, 'missing_audio');

  // Basic size & mime checks
  const mime = audio.type || 'application/octet-stream';
  if (!ALLOWED.has(mime)) return fail(400, 'bad_mime');
  const size = (audio as any).size ?? (await audio.arrayBuffer()).byteLength;
  if (size > MAX_BYTES) return fail(400, 'too_large');

  // Mock mode (no external call)
  if (process.env.NEXT_PUBLIC_ENABLE_MOCK_STT === 'true') {
    logRequest(req, '/api/stt', Date.now() - t0);
    return ok({ transcript: 'MOCK_TRANSCRIPT' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return fail(503, 'stt_unavailable');
  }

  // Prepare multipart body for OpenAI Whisper
  const fd = new FormData();
  const buf = Buffer.from(await audio.arrayBuffer());
  fd.append('file', new Blob([buf], { type: mime }), 'audio');
  fd.append('model', 'whisper-1');
  fd.append('language', lang);

  const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: fd as any,
  });

  if (!r.ok) {
    return fail(502, 'stt_failed');
  }

  const data = await r.json();
  const transcript = (data?.text || '').trim();

  logRequest(req, '/api/stt', Date.now() - t0);
  return ok({ transcript });
}, '/api/stt');

