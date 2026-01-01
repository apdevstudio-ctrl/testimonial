# Deployment Guide for Vercel

This guide explains how to deploy the Testimonial SaaS application on Vercel.

## Architecture

The application consists of:
- **Backend**: NestJS API (needs separate hosting - cannot run on Vercel serverless)
- **Frontend**: Next.js application (can be deployed on Vercel)

## ⚠️ Important: Backend Deployment

**The NestJS backend cannot be deployed on Vercel** because:
- Vercel functions have execution time limits (10s for Hobby, 60s for Pro)
- NestJS requires persistent connections and long-running processes
- MongoDB connections need to stay alive

### Backend Deployment Options:

1. **Railway** (Recommended for simplicity)
   - Go to https://railway.app
   - Connect your GitHub repository
   - Select the `backend` folder
   - Add environment variables
   - Deploy automatically

2. **Render**
   - Go to https://render.com
   - Create a new Web Service
   - Connect your GitHub repository
   - Build command: `cd backend && npm install && npm run build`
   - Start command: `cd backend && npm run start:prod`
   - Add environment variables

3. **DigitalOcean App Platform**
   - Create new app from GitHub
   - Select backend folder
   - Configure build and start commands

4. **AWS/Google Cloud/Azure**
   - Use container services (ECS, Cloud Run, App Service)
   - Or EC2/Compute Engine for full control

## Frontend Deployment on Vercel

### Step 1: Prepare for Deployment

1. **Install Vercel CLI** (optional, you can use the web interface):
   ```bash
   npm i -g vercel
   ```

### Step 2: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (or `cd frontend && npm run build`)
   - **Output Directory**: `.next`
   - **Install Command**: `npm install` (or `cd frontend && npm install`)

### Step 3: Environment Variables

Add these environment variables in Vercel:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
# or
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

**Note**: Make sure the backend URL doesn't have a trailing slash.

### Step 4: Configure Vercel Settings

In your Vercel project settings:

1. **General** → **Root Directory**: Set to `frontend`
2. **Environment Variables**: Add `NEXT_PUBLIC_API_URL`
3. **Build & Development Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Step 5: Deploy

Click "Deploy" and wait for the build to complete.

## Alternative: Deploy via CLI

```bash
cd frontend
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No**
- What's your project's name? `testimonial-saas-frontend`
- In which directory is your code located? `./`
- Override settings? **No**

After first deployment:
```bash
vercel --prod
```

## Backend Environment Variables

When deploying the backend (Railway/Render/etc.), set these environment variables:

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-jwt-key-change-this
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://your-vercel-app.vercel.app
API_URL=https://your-backend-url.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Database Setup

1. **MongoDB Atlas** (Recommended):
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get connection string
   - Add to backend environment variables

2. **Or use Railway's MongoDB service**:
   - Add MongoDB service in Railway
   - Use the provided connection string

## CORS Configuration

Make sure your backend allows requests from your Vercel frontend:

In `backend/src/main.ts`, the CORS is already configured to accept all origins, but you can restrict it:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
});
```

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] MongoDB connection working
- [ ] Test user registration/login
- [ ] Test site creation
- [ ] Test testimonial submission
- [ ] CORS configured correctly

## Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Ensure backend URL is accessible
- Check CORS settings in backend

### Build fails on Vercel
- Check Node.js version (Vercel auto-detects, but you can set it in `package.json`)
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

### Backend deployment issues
- Check MongoDB connection string
- Verify all environment variables are set
- Check logs for specific errors
- Ensure PORT is set correctly

## Quick Deploy Commands

**Frontend (Vercel)**:
```bash
cd frontend
vercel --prod
```

**Backend (Railway - after connecting repo)**:
- Automatic deployments on git push

## Support

For issues, check:
- Vercel deployment logs
- Backend service logs (Railway/Render dashboard)
- MongoDB Atlas connection status
- Environment variables configuration

