# Testimonial SaaS Frontend Dashboard

Next.js dashboard for managing testimonial collection sites.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3001`

## Features

- **Site Management**: Create and manage multiple sites
- **Configuration Builder**: Customize button settings, position, text, colors
- **Theme Management**: Customize colors, fonts, border radius
- **Analytics Dashboard**: View engagement metrics and statistics
- **Testimonial Management**: View and manage submitted testimonials
- **Integration Code**: Copy-paste script integration code

## Pages

- `/` - Site list and management
- `/sites/[siteId]` - Individual site configuration and management

## Environment Variables

Set `API_URL` in `next.config.js` or as environment variable (defaults to `http://localhost:3000`)

