# Vercel 405 Error Troubleshooting

Since your root directory is already set to `frontend` but you're still getting 405 errors, try these steps:

## 1. Clear Vercel Build Cache

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **General**
3. Scroll down to **Build & Development Settings**
4. Click **Clear Build Cache**
5. Trigger a new deployment

## 2. Force a Clean Redeploy

1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. Check **"Use existing Build Cache"** - UNCHECK THIS
5. Click **Redeploy**

## 3. Check Deployment Logs

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Check the **Build Logs** and **Function Logs**
4. Look for any errors related to API routes

You should see in the build logs:
```
Route (app)                              Size     First Load JS
├ λ /api/auth/login                      0 B                0 B
├ λ /api/auth/register                   0 B                0 B
```

If these routes are NOT listed, the build isn't including them correctly.

## 4. Verify Environment Variables

Make sure these are set in Vercel (Settings → Environment Variables):
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 5. Check Function Runtime

1. Go to **Settings** → **Functions**
2. Ensure Node.js version is compatible (18.x or 20.x)
3. Check if there are any function size/timeout limits that might be affecting routes

## 6. Test the Health Endpoint

Try accessing: `https://your-domain.vercel.app/api/health`

If this works (returns 200), the API routes are working, but there might be an issue with the auth routes specifically.

If it returns 405, then all API routes have the same issue.

## 7. Verify Route Files Are Deployed

In Vercel dashboard:
1. Go to **Deployments**
2. Click on a deployment
3. Click **Browse Files**
4. Navigate to `.next/server/app/api/auth/login/`
5. Verify `route.js` exists

## 8. Check for Middleware Conflicts

If you have a `middleware.ts` file in the `frontend/` directory, it might be interfering. Check if it's blocking API routes.

## 9. Try a Test Deployment

Create a simple test route to verify routes work:

Create `frontend/app/api/test/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Test route works' });
}

export async function POST() {
  return NextResponse.json({ message: 'POST works' });
}
```

Then test:
- `GET https://your-domain.vercel.app/api/test`
- `POST https://your-domain.vercel.app/api/test`

If this works but auth routes don't, there's something specific to the auth routes.

