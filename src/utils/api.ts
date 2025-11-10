import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logRequest } from '@/middleware/log';

export function ok<T>(data: T, init?: ResponseInit): NextResponse<T> {
  return NextResponse.json(data, { status: 200, ...init });
}

export function fail(code: number, message: string): NextResponse<{ error: string }> {
  return NextResponse.json({ error: message }, { status: code });
}

type Handler = (req: NextRequest) => Promise<NextResponse>;

export function wrap(handler: Handler, route: string): Handler {
  return async (req: NextRequest) => {
    const t0 = Date.now();
    try {
      return await handler(req);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
        const status = typeof error.status === 'number' ? error.status : 500;
        const message = typeof error.message === 'string' ? error.message : 'Internal server error';
        return fail(status, message);
      }
      return fail(500, 'Internal server error');
    } finally {
      logRequest(req, route, Date.now() - t0);
    }
  };
}

