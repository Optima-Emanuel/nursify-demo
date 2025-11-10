# Vercel Deployment Checklist

## Step-by-Step Deployment Guide

### 1. Import GitHub Repository
- [ ] Go to [https://vercel.com/new](https://vercel.com/new)
- [ ] Click "Import Git Repository"
- [ ] Select `Optima-Emanuel/nursify-demo` from your GitHub repositories
- [ ] Click "Import"

### 2. Framework Configuration
- [ ] Verify Framework Preset is set to **Next.js** (should auto-detect)
- [ ] Root Directory: `./` (default)
- [ ] Build Command: `next build` (auto-detected)
- [ ] Output Directory: `.next` (auto-detected)
- [ ] Install Command: `npm install` (auto-detected)

### 3. Environment Variables
Add the following environment variables in the Vercel dashboard:

- [ ] **NEXT_PUBLIC_APP_NAME** = `Nursify Demo`
- [ ] **NEXT_PUBLIC_APP_LANGS** = `de,en,id`
- [ ] **OPENAI_API_KEY** = (leave blank for now)
- [ ] **ELEVENLABS_API_KEY** = (leave blank for now)
- [ ] **ELEVENLABS_VOICE_ID** = (leave blank for now)

**Note:** Make sure to add these to all environments (Production, Preview, Development) if you want them available everywhere.

### 4. Build & Deploy
- [ ] Click "Deploy" button
- [ ] Wait for build to complete (watch the build logs)
- [ ] Verify deployment succeeds (green checkmark)

### 5. Verification
After deployment completes:

- [ ] Visit your Vercel deployment URL (e.g., `https://nursify-demo.vercel.app`)
- [ ] Verify homepage (`/`) renders correctly:
  - [ ] App name displays: "Nursify Demo"
  - [ ] Supported languages list shows: de, en, id
  - [ ] Link to `/api/health` is visible
  - [ ] Note about APIs being stubbed (501) is visible
- [ ] Test health endpoint (`/api/health`):
  - [ ] Visit `https://your-app.vercel.app/api/health`
  - [ ] Verify response contains:
    ```json
    {
      "status": "ok",
      "time": "<ISO timestamp>",
      "app": "Nursify Demo",
      "langs": "de,en,id"
    }
    ```

### 6. Post-Deployment
- [ ] Bookmark your Vercel dashboard URL
- [ ] Note your production domain
- [ ] (Optional) Set up a custom domain if needed

---

## Future Secret Management

**Important Note:** When you're ready to add GPT/ElevenLabs integration:

1. **No code changes needed** - The infrastructure is already set up
2. Simply update the three environment variables in Vercel:
   - `OPENAI_API_KEY` - Add your OpenAI API key
   - `ELEVENLABS_API_KEY` - Add your ElevenLabs API key
   - `ELEVENLABS_VOICE_ID` - Add your ElevenLabs voice ID
3. Redeploy (or wait for automatic redeploy on next push)
4. The `src/lib/env.ts` validation will automatically pick up the new values

The environment validation in `src/lib/env.ts` already handles these as optional, so the app will work fine with empty values until you're ready to add them.

