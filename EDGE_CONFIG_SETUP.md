# Edge Config Setup Instructions

## Option 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel project dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Select your `nursify-demo` project

2. **Navigate to Edge Config**
   - Click on **Settings** tab
   - Click on **Edge Config** in the left sidebar
   - If no Edge Config exists, click **Create Database** → **Edge Config**

3. **Add the features item**
   - Click **Add Item** or **Create Item**
   - **Key**: `features`
   - **Value** (select JSON):
     ```json
     {
       "lesson": false,
       "dialog": true,
       "test": false,
       "gamification": false
     }
     ```
   - Click **Save**

4. **Verify**
   - The item should appear in your Edge Config list
   - Vercel automatically wires the connection (no code changes needed)

## Option 2: Via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project** (from project root):
   ```bash
   cd nursify-demo
   vercel link
   ```

4. **Create Edge Config**:
   ```bash
   # First, create the Edge Config store (if not exists)
   vercel edge-config create
   
   # Then add the features item
   # Note: Vercel CLI doesn't have a direct command for this,
   # so use the dashboard method above instead
   ```

## Verification

After setup, your app will automatically:
- Fetch features from Edge Config at runtime
- No redeploy needed when you change flags
- Changes take effect immediately

Test by:
1. Changing `dialog` to `false` in Edge Config
2. Refresh your app - Dialog nav item should disappear
3. Change it back to `true` - Dialog nav item should reappear

