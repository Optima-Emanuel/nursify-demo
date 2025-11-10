# Nursify Demo

## Purpose

Demo infrastructure for testing API integrations. This is a technical demo focused on infrastructure and API endpoints, not product features.

## Stack

- **Next.js** App Router
- **TypeScript**
- **Tailwind CSS**

## Endpoints

### API Routes

- `GET /api/health` - Health check endpoint
- `POST /api/chat` - Chat completion (OpenAI)
- `POST /api/tts` - Text-to-speech (ElevenLabs)
- `POST /api/stt` - Speech-to-text (OpenAI Whisper)
- `POST /api/score` - Transcript scoring

### Development Pages

- `/dev` - Development tools index
- `/dev/chat` - Chat testing interface
- `/dev/tts` - Text-to-speech testing interface
- `/dev/stt` - Speech-to-text testing interface
- `/dev/score` - Scoring testing interface

## Environment Variables

### Mock Flags (for demo mode)

Set to `"true"` to enable mock responses when API keys are not available:

```
NEXT_PUBLIC_ENABLE_MOCK_CHAT=true
NEXT_PUBLIC_ENABLE_MOCK_TTS=true
NEXT_PUBLIC_ENABLE_MOCK_STT=true
```

### API Keys (for production mode)

Set mock flags to `"false"` and provide:

- `OPENAI_API_KEY` - Required for chat and STT
- `ELEVENLABS_API_KEY` - Required for TTS
- `ELEVENLABS_VOICE_ID` - Optional (defaults to `EXAVITQu4vr4xnSDxMaL`)

## Local Development

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## Vercel Deployment Checklist

- [ ] Set environment variables (mock flags or API keys)
- [ ] Verify Node.js version ≥ 18.18 (set in `package.json`)
- [ ] Deploy via Vercel CLI or GitHub integration
- [ ] Verify `/api/health` returns `{ status: "ok", ... }`
- [ ] Test dev pages: `/dev/chat`, `/dev/tts`, `/dev/stt`, `/dev/score` (all should return 200)

See [DEPLOY_NOTES.md](./DEPLOY_NOTES.md) for detailed deployment instructions.

## Troubleshooting

### Node.js Version

Ensure Node.js ≥ 18.18 is installed:

```bash
node --version
```

### Missing Environment Variables

- If API keys are missing, set mock flags to `"true"` for demo mode
- Check `.env.local` file exists for local development
- Verify environment variables are set in Vercel dashboard for production

### Microphone Permissions

For `/dev/stt` (speech-to-text):
- Browser will request microphone permission on first use
- Ensure browser has microphone access enabled
- Check browser settings if permission prompt doesn't appear

## Feature Flags

Feature flags are managed via **Vercel Edge Config** for runtime toggles without redeploying.

### Setup

1. Install the Edge Config package:
   ```bash
   npm install @vercel/edge-config
   ```

2. In Vercel Dashboard → Your Project → **Edge Config**:
   - Create a new Edge Config (if not exists)
   - Add a JSON item named `features` with:
     ```json
     {
       "lesson": false,
       "dialog": true,
       "test": false,
       "gamification": false
     }
     ```

3. Vercel automatically wires the Edge Config connection (no secrets needed in code).

### Available Flags

- `lesson` (boolean)
- `dialog` (boolean)
- `test` (boolean)
- `gamification` (boolean)

Update flags in Vercel Edge Config to toggle features instantly without redeploying.
