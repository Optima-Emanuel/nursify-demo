import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { assertRateLimit } from '@/middleware/rateLimit';
import { wrap } from '@/utils/api';

// TODO: Implement chat endpoint for conversational AI interactions
// This will handle user messages and return AI responses using OpenAI API
async function handler(req: NextRequest): Promise<NextResponse> {
  assertRateLimit(req, 'chat');
  throw { status: 501, message: 'not_implemented' };
}

export const POST = wrap(handler, 'chat');

