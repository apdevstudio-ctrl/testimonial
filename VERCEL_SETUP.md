# Vercel Deployment Setup Guide

## Critical: Root Directory Configuration

Your Next.js app is in the `frontend/` subdirectory, but Vercel needs to know this.

### Steps to Fix 405 Errors:

1. **Go to Vercel Dashboard**
   - Navigate to your project settings
   - Go to **Settings** → **General**

2. **Set Root Directory**
   - Find the **Root Directory** setting
   - Change it from `/` (root) to `frontend`
   - Click **Save**

3. **Update Build Settings (if needed)**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build` (should auto-detect)
   - Output Directory: `.next` (should auto-detect)
   - Install Command: `npm install` (should auto-detect)

4. **Redeploy**
   - After changing the Root Directory, trigger a new deployment
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment
   - Or push a new commit to trigger auto-deploy

## Environment Variables

Make sure these are set in Vercel (Settings → Environment Variables):

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `NEXT_PUBLIC_API_URL` - Your Vercel deployment URL (optional, defaults to relative URLs)

## Why This Happens

When Vercel uses the root directory (`/`) instead of `frontend/`, it:
- Can't find `app/api/` routes (they're in `frontend/app/api/`)
- Builds from the wrong directory
- Returns 405 Method Not Allowed because routes aren't registered

## Verify It's Working

After setting Root Directory to `frontend` and redeploying:
1. Check build logs - you should see routes being compiled:
   ```
   Route (app)                              Size     First Load JS
   ├ λ /api/auth/login                      0 B                0 B
   ├ λ /api/auth/register                   0 B                0 B
   ```

2. Test the endpoints:
   - `POST https://your-domain.vercel.app/api/auth/register`
   - `POST https://your-domain.vercel.app/api/auth/login`

