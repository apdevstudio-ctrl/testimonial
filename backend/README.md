# Testimonial SaaS Backend

NestJS backend API for the testimonial collection platform.

## Features

- Site configuration management
- Testimonial CRUD operations (video & text)
- Analytics event tracking
- Credit/incentive system with webhooks
- Cloudinary video upload integration
- Domain validation
- Rate limiting
- MongoDB data persistence

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/testimonial-saas
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3001
API_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

3. Start MongoDB (make sure it's running)

4. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Sites
- `GET /api/sites` - Get all sites
- `GET /api/sites/:siteId` - Get site by ID
- `POST /api/sites` - Create new site
- `PUT /api/sites/:siteId` - Update site
- `DELETE /api/sites/:siteId` - Delete site

### Configuration (Public)
- `GET /api/config/:siteId` - Get public site configuration (used by script)

### Testimonials
- `GET /api/testimonials` - Get all testimonials (query: `?siteId=xxx`)
- `GET /api/testimonials/:id` - Get testimonial by ID
- `POST /api/testimonials` - Submit testimonial (multipart/form-data)

### Analytics
- `POST /api/analytics/events` - Track event
- `GET /api/analytics/stats?siteId=xxx` - Get analytics stats

### Credits
- `POST /api/credits` - Issue credit
- `GET /api/credits?email=xxx&siteId=xxx` - Get user credits

### Script
- `GET /script.js` - Serve injectable JavaScript script

## Security Features

- **Rate Limiting**: Configurable rate limiting on testimonial submissions and analytics
- **Domain Validation**: Optional domain validation for site configurations
- **CORS**: Configured for frontend and script access
- **Helmet**: Security headers

## Database Models

### Site
- Site configuration (button, theme, features)
- Domain validation
- Active status

### Testimonial
- Video or text testimonials
- Author information
- Approval/publishing status
- Metadata (user agent, IP, etc.)

### AnalyticsEvent
- Event tracking (button views, clicks, submissions)
- Properties and metadata

### Credit
- Credit issuance for testimonials
- Webhook integration
- Redemption tracking

