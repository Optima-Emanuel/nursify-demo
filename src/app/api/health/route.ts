import type { NextRequest } from 'next/server';
import env from '@/lib/env';
import { ok, wrap } from '@/utils/api';

async function handler(req: NextRequest) {
  return ok({
    status: 'ok',
    time: new Date().toISOString(),
    app: env.NEXT_PUBLIC_APP_NAME,
    langs: env.NEXT_PUBLIC_APP_LANGS,
  });
}

export const GET = wrap(handler, 'health');

