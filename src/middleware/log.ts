import type { NextRequest } from 'next/server';

export function logRequest(req: NextRequest, label: string, duration: number) {
  const method = req.method;
  const url = req.url;
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';
  console.log(`[${label}] ${method} ${url} - IP: ${ip} - ${duration}ms`);
}

