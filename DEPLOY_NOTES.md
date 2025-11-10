# Deployment Notes

## Environment Variables

### Option 1: Demo Mode (No API Keys)

If you don't set API keys, set these flags to `"true"` so the demo still works:

```
NEXT_PUBLIC_ENABLE_MOCK_CHAT=true
NEXT_PUBLIC_ENABLE_MOCK_TTS=true
NEXT_PUBLIC_ENABLE_MOCK_STT=true
```

### Option 2: Production Mode (With API Keys)

If you do set keys, keep flags `"false"`:

```
NEXT_PUBLIC_ENABLE_MOCK_CHAT=false
NEXT_PUBLIC_ENABLE_MOCK_TTS=false
NEXT_PUBLIC_ENABLE_MOCK_STT=false
```

**Required API Keys:**

- `OPENAI_API_KEY` - Used for chat and speech-to-text
- `ELEVENLABS_API_KEY` - Used for text-to-speech

**Optional:**

- `ELEVENLABS_VOICE_ID` - Custom voice ID for ElevenLabs (defaults to `EXAVITQu4vr4xnSDxMaL` if not set)

## Post-Deployment Verification

After deployment, verify the following endpoints:

1. **Health Check:**
   - `GET /api/health` should return `{ status: "ok", ... }`

2. **Development Pages (should respond with 200):**
   - `GET /dev/chat`
   - `GET /dev/tts`
   - `GET /dev/stt`
   - `GET /dev/score` (or `/dev` which may include score functionality)

