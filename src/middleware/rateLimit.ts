import type { NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

type RateLimitKey = string;
type Timestamp = number;

const rateLimitMap = new Map<RateLimitKey, Timestamp[]>();

function getRateLimitKey(req: NextRequest, route: string): RateLimitKey {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';
  return `${ip}:${route}`;
}

function cleanupOldEntries(key: RateLimitKey, now: number) {
  const timestamps = rateLimitMap.get(key);
  if (!timestamps) return;

  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const filtered = timestamps.filter((ts) => ts > cutoff);

  if (filtered.length === 0) {
    rateLimitMap.delete(key);
  } else {
    rateLimitMap.set(key, filtered);
  }
}

export function assertRateLimit(req: NextRequest, route: string): void {
  const key = getRateLimitKey(req, route);
  const now = Date.now();

  cleanupOldEntries(key, now);

  const timestamps = rateLimitMap.get(key) || [];
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    throw { status: 429, message: 'rate_limited' };
  }

  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
}

