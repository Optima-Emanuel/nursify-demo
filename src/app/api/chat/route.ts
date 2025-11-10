import type { NextRequest } from 'next/server';
import env from '@/lib/env';
import { assertRateLimit } from '@/middleware/rateLimit';
import { ok, fail, wrap } from '@/utils/api';

type Body = {
  scene?: string;
  user?: string;
  lang?: string;
};

async function handler(req: NextRequest) {
  assertRateLimit(req, '/api/chat');

  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    return fail(503, 'chat_unavailable');
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return fail(400, 'invalid_body');
  }

  const scene = typeof body.scene === 'string' ? body.scene.trim() : '';
  const user = typeof body.user === 'string' ? body.user.trim() : '';
  const lang = typeof body.lang === 'string' && body.lang.trim().length > 0 ? body.lang.trim() : 'de';

  if (!scene || !user) {
    return fail(400, 'missing_params');
  }

  const systemPrompt = [
    'You simulate short, safe, supportive nursing dialogs.',
    'Keep replies concise (<= 2 sentences).',
    'Be polite, clear, and use plain language.',
    `Language: ${lang}. Scene: ${scene}.`,
  ].join(' ');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: user },
      ],
    }),
  });

  if (!response.ok) {
    return fail(502, 'chat_failed');
  }

  const data = await response.json();
  const reply = typeof data?.choices?.[0]?.message?.content === 'string' ? data.choices[0].message.content : '';

  return ok({ reply, hints: [] });
}

export const POST = wrap(handler, '/api/chat');
