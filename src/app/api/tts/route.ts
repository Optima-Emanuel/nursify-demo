import type { NextRequest } from 'next/server';
import { assertRateLimit } from '@/middleware/rateLimit';
import { wrap } from '@/utils/api';

// TODO: Implement text-to-speech endpoint
// This will convert text to speech using ElevenLabs API and return audio
async function handler(req: NextRequest) {
  assertRateLimit(req, 'tts');
  throw { status: 501, message: 'not_implemented' };
}

export const POST = wrap(handler, 'tts');

