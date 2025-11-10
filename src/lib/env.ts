import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('Nursify Demo'),
  NEXT_PUBLIC_APP_LANGS: z.string().default('de,en,id'),
  NEXT_PUBLIC_ENABLE_MOCK_CHAT: z.string().default('false'),
  NEXT_PUBLIC_ENABLE_MOCK_TTS: z.string().default('false'),
  NEXT_PUBLIC_ENABLE_MOCK_STT: z.string().default('false'),
  OPENAI_API_KEY: z.string().optional(),
  ELEVENLABS_API_KEY: z.string().optional(),
  ELEVENLABS_VOICE_ID: z.string().optional(),
});

const env = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? undefined,
  NEXT_PUBLIC_APP_LANGS: process.env.NEXT_PUBLIC_APP_LANGS ?? undefined,
  NEXT_PUBLIC_ENABLE_MOCK_CHAT: process.env.NEXT_PUBLIC_ENABLE_MOCK_CHAT ?? undefined,
  NEXT_PUBLIC_ENABLE_MOCK_TTS: process.env.NEXT_PUBLIC_ENABLE_MOCK_TTS ?? undefined,
  NEXT_PUBLIC_ENABLE_MOCK_STT: process.env.NEXT_PUBLIC_ENABLE_MOCK_STT ?? undefined,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID,
});

export type Env = z.infer<typeof envSchema>;

export default env;

