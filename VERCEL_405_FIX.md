# Vercel 405 Error - Complete Fix Guide

## What We've Done

1. ✅ Added explicit `runtime = 'nodejs'` to all auth route handlers
2. ✅ Removed problematic `outputFileTracingIncludes` config
3. ✅ Fixed all API URLs to use relative paths
4. ✅ Verified routes are committed and build correctly

## Critical Steps to Fix 405 on Vercel

### Step 1: Verify Vercel Settings

1. **Root Directory**: Must be set to `frontend`
   - Go to: Settings → General → Root Directory
   - Should be: `frontend` (not `/` or empty)

2. **Environment Variables**: Remove `NEXT_PUBLIC_API_URL`
   - Go to: Settings → Environment Variables
   - **DELETE** `NEXT_PUBLIC_API_URL` if it exists
   - Keep these:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`

### Step 2: Clear Everything and Rebuild

1. **Clear Build Cache:**
   - Settings → General → "Build & Development Settings"
   - Click **"Clear Build Cache"**

2. **Delete Old Deployments (Optional but recommended):**
   - Go to Deployments tab
   - Delete all old failed deployments
   - This forces a completely fresh build

3. **Redeploy:**
   - Click "Redeploy" on latest deployment
   - **UNCHECK** "Use existing Build Cache"
   - Click "Redeploy"

### Step 3: Verify Build Logs

After deployment, check Build Logs for:
```
Route (app)                              Size     First Load JS
├ λ /api/auth/login                      0 B                0 B
├ λ /api/auth/register                   0 B                0 B
├ λ /api/auth/me                         0 B                0 B
```

If these routes are **NOT** listed, the build failed to include them.

### Step 4: Test the Routes

After deployment, test directly:

```bash
# Test health endpoint (should work)
curl https://your-vercel-url.vercel.app/api/health

# Test login endpoint
curl -X POST https://your-vercel-url.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

Expected responses:
- `/api/health`: Should return 200 with `{"status":"ok"}`
- `/api/auth/login`: Should return 400/401 (not 405!)

### Step 5: Check Function Logs

1. Go to Deployments → Latest deployment
2. Click "Functions" tab
3. Look for `/api/auth/login`
4. Check what methods it shows (should show POST)

## If Still Getting 405

### Option A: Check Vercel Project Settings

1. Go to Settings → General
2. Check "Framework Preset" - should be **Next.js**
3. Check "Build Command" - should be `npm run build` (or auto-detected)
4. Check "Output Directory" - should be `.next` (or auto-detected)
5. Check "Install Command" - should be `npm install` (or auto-detected)

### Option B: Check for Conflicting Routes

Make sure there's no:
- `pages/api/` directory (conflicts with `app/api/`)
- Custom rewrites in `next.config.js` that might interfere
- Middleware that blocks API routes

### Option C: Create a Test Route

Create `frontend/app/api/test/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ message: 'Test route works!' });
}

export async function POST() {
  return NextResponse.json({ message: 'POST works!' });
}
```

Then test:
- `GET /api/test` - should return 200
- `POST /api/test` - should return 200

If this works but auth routes don't, the issue is specific to those routes.

## Most Likely Cause

Based on the symptoms, the most likely cause is:
1. **Stale build cache** - Vercel is using an old build
2. **Root directory not set correctly** - Routes aren't being found
3. **Environment variables interfering** - `NEXT_PUBLIC_API_URL` set to localhost

## Next Steps

1. Follow all steps above
2. Wait for deployment to complete
3. Test the endpoints
4. Check Vercel function logs for any errors
5. Share the build logs if still not working

