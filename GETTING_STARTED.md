# Getting Started with Testimonial SaaS

This guide will help you set up and run the testimonial SaaS platform locally.

## Prerequisites

- Node.js 18+ installed
- MongoDB instance running (local or cloud)
- Cloudinary account (for video storage)
- Git

## Project Structure

```
testimonial-saas/
├── backend/       # NestJS API server
├── frontend/      # Next.js dashboard
├── script/        # Injectable JavaScript widget
└── README.md
```

## Quick Start

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install script dependencies
cd ../script
npm install
cd ..
```

### 2. Environment Setup

#### Backend (.env file in `backend/` directory)

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/testimonial-saas
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3001
API_URL=http://localhost:3000
SCRIPT_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend

The frontend uses environment variables from `next.config.js`. The API_URL defaults to `http://localhost:3000` but can be overridden.

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Or use MongoDB Atlas cloud instance
```

### 4. Build the Script

```bash
cd script
npm run build
cd ..
```

This creates `script/dist/testimonial-script.js` which the backend serves at `/script.js`.

### 5. Start the Backend

```bash
cd backend
npm run start:dev
```

Backend will run on `http://localhost:3000`

### 6. Start the Frontend Dashboard

In a new terminal:

```bash
cd frontend
npm run dev
```

Dashboard will run on `http://localhost:3001`

## Usage Workflow

### 1. Create a Site

1. Open `http://localhost:3001` in your browser
2. Click "Create New Site"
3. Enter a unique site ID (e.g., `my-website`) and name
4. Click "Create"

### 2. Configure Your Site

1. Click on your site to open the configuration page
2. Customize button settings (text, position, colors)
3. Configure theme (colors, fonts, border radius)
4. Enable/disable video or text testimonials
5. Choose flow type (modal, drawer, or page)
6. Save changes

### 3. Copy Integration Code

1. On the site configuration page, copy the script tag
2. Add it to your website's HTML:

```html
<script src="http://localhost:3000/script.js" data-site-id="my-website"></script>
```

### 4. Test the Integration

1. Open your website with the script tag
2. You should see a "Give Testimonial" button
3. Click it to test the testimonial flow
4. Submit a test testimonial (video or text)

### 5. View Results

1. Go back to the dashboard at `http://localhost:3001`
2. Navigate to your site
3. Check the "Analytics" tab for engagement metrics
4. Check the "Testimonials" tab to see submitted testimonials

## API Endpoints

### Public Endpoints (used by script)

- `GET /api/config/:siteId` - Get site configuration
- `POST /api/testimonials` - Submit testimonial
- `POST /api/analytics/events` - Track analytics event
- `GET /script.js` - Serve widget script

### Dashboard Endpoints

- `GET /api/sites` - List all sites
- `POST /api/sites` - Create site
- `GET /api/sites/:siteId` - Get site details
- `PUT /api/sites/:siteId` - Update site
- `GET /api/testimonials?siteId=xxx` - Get testimonials
- `GET /api/analytics/stats?siteId=xxx` - Get analytics stats

## Development

### Backend Development

```bash
cd backend
npm run start:dev  # Watch mode
npm run build      # Production build
```

### Frontend Development

```bash
cd frontend
npm run dev        # Development server
npm run build      # Production build
npm start          # Production server
```

### Script Development

```bash
cd script
npm run watch      # Watch mode for development
npm run build      # Production build
```

## Production Deployment

1. Build all packages:
   ```bash
   npm run build:all
   ```

2. Set production environment variables

3. Deploy backend to your server/cloud provider

4. Deploy frontend to Vercel/Netlify or your hosting provider

5. Update script URL in your deployment to point to production API

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check MONGODB_URI in `.env` file
- Ensure MongoDB accepts connections from your IP

### Script Not Loading
- Build the script: `cd script && npm run build`
- Check that `dist/testimonial-script.js` exists
- Verify backend is serving `/script.js` endpoint

### CORS Errors
- Update CORS origins in `backend/src/main.ts`
- Check FRONTEND_URL and SCRIPT_URL in `.env`

### Cloudinary Upload Issues
- Verify Cloudinary credentials in `.env`
- Check file size limits
- Ensure API keys have video upload permissions

## Next Steps

- Set up authentication for the dashboard
- Configure domain validation for sites
- Set up webhooks for credit system
- Customize theme and styling
- Deploy to production

## Support

For issues or questions, check the README files in each package directory for more specific documentation.

