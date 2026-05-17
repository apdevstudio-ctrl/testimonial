# TestiFlow

**Embeddable social proof infrastructure** — collect video and text testimonials, publish a Wall of Love, and embed beautiful widgets on any website.

Live product: [testiflow.site](https://testiflow.site)

---

## What TestiFlow provides

### Collection (get testimonials)

| Feature | Description |
|---------|-------------|
| **One-script embed** | Add `embed.js` once; floating button appears automatically |
| **Collect flows** | Modal, drawer, or full-page (iframe) submission |
| **Video testimonials** | In-browser recording; hosted on Cloudinary |
| **Text testimonials** | Star ratings, author name, company, position |
| **Custom forms** | Field designer, layouts, branding from dashboard |
| **Collection page** | Shareable `/collect/{siteId}` link |
| **Credits / incentives** | Reward customers who submit (optional) |

### Display (show testimonials)

| Feature | Description |
|---------|-------------|
| **Wall of Love** | Public SEO page at `/w/{slug}` |
| **Embed Studio** | Copy snippets for collect, wall iframe, and display |
| **8 themes** | minimal, glass, bold, saas, dark, warm, ocean, sunset |
| **8 layouts** | grid, carousel, marquee, list, bento, masonry, floating, columns |
| **Declarative embed** | `data-testiflow-wall` auto-renders without extra JS |
| **Iframe embed** | Auto-resizing Wall of Love for WordPress, Webflow, etc. |
| **Trust badges** | Verified customer, source labels on cards |
| **Powered by** | Optional branding link (hide on paid plans) |

### Developer experience

| Feature | Description |
|---------|-------------|
| **`/embed.js`** | Unified loader (alias of `script.js`) |
| **`@testiflow/react`** | `TestiflowWall`, `TestiflowCarousel`, `TestiflowMarquee`, `TestiflowModal` |
| **Public API** | `GET /api/public/walls/{slug}` |
| **REST API** | Testimonials, config, analytics events |
| **Auto-render** | Multiple widgets per page via `data-*` attributes |

### SEO & growth

| Feature | Description |
|---------|-------------|
| **Indexable walls** | Public walls in dynamic sitemap |
| **Dynamic metadata** | Title, description, OG, Twitter cards per wall |
| **OG images** | `/api/og/w/{slug}` — auto-generated share images |
| **JSON-LD** | Review / ItemList schema on public walls |
| **Integration pages** | WordPress, Webflow, Framer, React, Next.js, Shopify |
| **Docs** | `/docs` — getting started, API, themes, layouts |

### Dashboard & analytics

| Feature | Description |
|---------|-------------|
| **Site management** | Multiple sites per account |
| **Visual builder** | Form + display customization |
| **Moderation** | Approve / publish testimonials |
| **Analytics** | Button views, clicks, submissions, wall views |
| **Onboarding wizard** | 3-step setup for new users |
| **Subscriptions** | Lemon Squeezy billing (trial + paid plans) |

### AI (optional)

| Feature | Description |
|---------|-------------|
| **AI enrichment** | Summary, headline, sentiment, tags (`POST /api/ai/enrich`) |
| **OpenAI** | Set `OPENAI_API_KEY`; falls back to heuristics if unset |

---

## Quick start

### 1. Sign up and create a site

1. Go to [testiflow.site/signup](https://testiflow.site/signup)
2. Create a site in the **Dashboard**
3. Open **Embed Studio** on your site page and copy the snippet you need

### 2. Collect testimonials (script)

```html
<script src="https://testiflow.site/embed.js" data-site-id="YOUR_SITE_ID" async></script>
```

Paste before `</body>`. A floating **Give Testimonial** button appears. Configure button, theme, and flow (modal/drawer/page) in the dashboard.

### 3. Display a Wall of Love (declarative — recommended)

```html
<div
  data-testiflow-wall="YOUR_SITE_ID"
  data-layout="grid"
  data-theme="saas"
  data-limit="12"
>
</div>
<script src="https://testiflow.site/embed.js" async></script>
```

Publish testimonials in the dashboard first (**Testimonials** tab → **Publish**).

### 4. Share your public wall (SEO)

Your wall lives at:

```
https://testiflow.site/w/your-public-slug
```

Set the slug under **Configuration → Wall of Love** in the dashboard.

---

## Integration guide

Full copy-paste examples, platform guides, troubleshooting, and API reference:

**[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)**

In-app guide (when running locally or on production):

```
/integration-guide
```

Additional docs:

```
/docs/getting-started
/docs/embed-guide
/docs/react-sdk
```

Platform-specific pages:

```
/integrations/wordpress
/integrations/webflow
/integrations/nextjs
/integrations/react
/integrations/shopify
/integrations/framer
```

---

## Project structure

```
testimonial/
├── frontend/          # Next.js app (dashboard, API routes, marketing, walls)
├── script/            # Injectable embed.js / script.js bundle
├── packages/react/    # @testiflow/react SDK
├── README.md
└── INTEGRATION_GUIDE.md
```

> Note: A legacy `backend/` NestJS package may exist in the monorepo; the production app uses **Next.js API routes** under `frontend/app/api/`.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| App & API | Next.js 14 (App Router), TypeScript |
| Database | MongoDB (Mongoose) |
| Video | Cloudinary |
| Embeds | Vanilla JS (Shadow DOM), iframe-resizer |
| Styling | Tailwind CSS |
| Billing | Lemon Squeezy |
| OG images | @vercel/og |

---

## Development

### Prerequisites

- Node.js 18+
- MongoDB
- Cloudinary account
- (Optional) OpenAI API key for AI enrichment

### Install

```bash
npm run install:all
```

### Environment

Copy `frontend/.env.example` to `frontend/.env.local` and fill in:

- `MONGODB_URI`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL`
- Lemon Squeezy keys
- `OPENAI_API_KEY` (optional)

### Run locally

```bash
# Terminal 1 — dashboard (port 3001)
npm run dev:frontend

# Terminal 2 — rebuild embed script after script/ changes
npm run build:script
```

### Build for production

```bash
npm run build:script
cd frontend && npm run build
```

---

## Embed URLs reference

| URL | Purpose |
|-----|---------|
| `/embed.js` | Main embed script |
| `/script.js` | Same bundle (legacy path) |
| `/w/{slug}` | Public Wall of Love (SEO) |
| `/embed/w/{siteId}` | Iframe wall embed |
| `/collect/{siteId}` | Collection / share page |
| `/api/public/walls/{slug}` | Public wall JSON |
| `/api/config/{siteId}` | Widget config for script |
| `/api/og/w/{slug}` | Dynamic Open Graph image |

---

## Data attributes (declarative embed)

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-testiflow-wall` | site ID | Auto-render wall in this element |
| `data-testiflow-collect` | site ID | Auto-init collect button |
| `data-layout` | grid, carousel, marquee, list, bento, masonry, floating, columns | Wall layout |
| `data-theme` | minimal, glass, bold, saas, dark, warm, ocean, sunset | Theme preset |
| `data-limit` | number | Max testimonials to show |

---

## React SDK

```bash
npm install @testiflow/react
```

```tsx
import { TestiflowWall } from '@testiflow/react';

export default function PricingPage() {
  return (
    <TestiflowWall
      siteId="YOUR_SITE_ID"
      layout="bento"
      theme="saas"
      limit={12}
    />
  );
}
```

See `packages/react/` and [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md#react-sdk).

---

## License

ISC
