# Smoke Test Checklist

## Local Testing

1. **Start dev server**
   ```bash
   npm run dev
   ```
   - [ ] Server starts on `http://localhost:3000`
   - [ ] No errors in console

2. **Test homepage (`/`)**
   - [ ] Open `http://localhost:3000`
   - [ ] App name displays: "Nursify Demo"
   - [ ] Supported languages list shows: de, en, id
   - [ ] Link to `/api/health` is visible
   - [ ] Note "APIs are stubbed (501)" is visible

3. **Test health endpoint (`/api/health`)**
   - [ ] Open `http://localhost:3000/api/health`
   - [ ] Returns JSON:
     ```json
     {
       "status": "ok",
       "time": "<ISO timestamp>",
       "app": "Nursify Demo",
       "langs": "de,en,id"
     }
     ```

## Vercel Testing

1. **Test homepage (`/`)**
   - [ ] Open deployed URL (e.g., `https://nursify-demo.vercel.app`)
   - [ ] App name displays: "Nursify Demo"
   - [ ] Supported languages list shows: de, en, id
   - [ ] Link to `/api/health` is visible
   - [ ] Note "APIs are stubbed (501)" is visible

2. **Test health endpoint (`/api/health`)**
   - [ ] Open `https://your-app.vercel.app/api/health`
   - [ ] Returns JSON:
     ```json
     {
       "status": "ok",
       "time": "<ISO timestamp>",
       "app": "Nursify Demo",
       "langs": "de,en,id"
     }
     ```

## Common Fixes

### Node Version Mismatch
**Symptoms:** Build fails, runtime errors, "module not found" errors

**Fix:**
- **Local:** Ensure Node.js version matches `.nvmrc` (v20)
  ```bash
  nvm use  # or: node --version should show v20.x.x
  ```
- **Vercel:** Check Node.js version in project settings (should be 18.x or 20.x)

### Environment Variables Not Loaded
**Symptoms:** App name shows default, env values missing, API keys undefined

**Fix:**
- **Local:** Check `.env` file exists and has correct values
  ```bash
  cat .env  # Verify variables are set
  ```
- **Vercel:** 
  - Go to Project Settings → Environment Variables
  - Verify all variables are set (can be empty for optional ones)
  - Ensure variables are added to correct environments (Production/Preview/Development)
  - Redeploy after adding variables

### Build Cache Issues
**Symptoms:** Stale code, old dependencies, build succeeds but app behaves incorrectly

**Fix:**
- **Local:**
  ```bash
  rm -rf .next node_modules
  npm ci
  npm run build
  ```
- **Vercel:**
  - Go to Project Settings → General
  - Click "Clear Build Cache"
  - Redeploy

