import type { NextRequest } from 'next/server';
import { assertRateLimit } from '@/middleware/rateLimit';
import { wrap } from '@/utils/api';

// TODO: Implement score endpoint for evaluating user performance
// This will analyze user responses and provide scoring/feedback
async function handler(req: NextRequest) {
  assertRateLimit(req, 'score');
  throw { status: 501, message: 'not_implemented' };
}

export const POST = wrap(handler, 'score');

