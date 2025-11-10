import type { NextRequest } from 'next/server';
import { ok, wrap } from '@/utils/api';
import { getFeatures } from '@/lib/features';

async function handler(req: NextRequest) {
  const features = await getFeatures();
  return ok(features);
}

export const GET = wrap(handler, '/api/features');

