import type { NextRequest } from 'next/server';
import { assertRateLimit } from '@/middleware/rateLimit';
import { wrap } from '@/utils/api';

// TODO: Implement speech-to-text endpoint
// This will convert audio/voice input to text using speech recognition API
async function handler(req: NextRequest) {
  assertRateLimit(req, 'stt');
  throw { status: 501, message: 'not_implemented' };
}

export const POST = wrap(handler, 'stt');

