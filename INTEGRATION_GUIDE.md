# TestiFlow Integration Guide

Complete guide to embedding TestiFlow on your website — collect testimonials, display a Wall of Love, and integrate with any platform.

**Dashboard:** [testiflow.site](https://testiflow.site) → create a site → **Embed Studio** for copy-paste snippets.

---

## Table of contents

1. [Before you start](#before-you-start)
2. [Embed types overview](#embed-types-overview)
3. [Collect testimonials](#collect-testimonials)
4. [Display testimonials](#display-testimonials)
5. [Wall of Love (public & SEO)](#wall-of-love-public--seo)
6. [Declarative auto-render](#declarative-auto-render)
7. [Iframe embeds](#iframe-embeds)
8. [Layouts & themes](#layouts--themes)
9. [React SDK](#react-sdk)
10. [Platform guides](#platform-guides)
11. [API reference](#api-reference)
12. [Analytics events](#analytics-events)
13. [AI enrichment](#ai-enrichment)
14. [Content Security Policy (CSP)](#content-security-policy-csp)
15. [Troubleshooting](#troubleshooting)

---

## Before you start

1. **Sign up** at [testiflow.site/signup](https://testiflow.site/signup)
2. **Create a site** in the dashboard (you receive a unique `siteId`)
3. **Configure** button, theme, and flow under your site settings
4. **Publish testimonials** in the **Testimonials** tab (drafts are not shown on public walls)
5. Copy embed code from **Embed Studio** on the site page

Replace `YOUR_SITE_ID` in all examples below with your actual site ID from the dashboard.

**Base URL:** `https://testiflow.site` (or your self-hosted origin in development).

---

## Embed types overview

| Type | Use case | Best for |
|------|----------|----------|
| **Script collect** | Floating button → modal/drawer form | SaaS apps, marketing sites |
| **Declarative wall** | `data-testiflow-wall` + `embed.js` | Fastest display setup |
| **Wall iframe** | Auto-resizing iframe | WordPress, Webflow, no-code |
| **Collect iframe** | Full-page form in iframe | Dedicated review page section |
| **Public URL** | `/w/your-slug` | SEO, sharing, link-in-bio |
| **React SDK** | `<TestiflowWall />` | Next.js, React apps |

---

## Collect testimonials

### Option A — Script tag (recommended)

Add before `</body>`:

```html
<script
  src="https://testiflow.site/embed.js"
  data-site-id="YOUR_SITE_ID"
  async
></script>
```

**What happens:**
- A floating **Give Testimonial** button appears (position, colors, text set in dashboard)
- Click opens **modal**, **drawer**, or **page** flow (configured per site)
- Users submit **video** or **text** testimonials
- Submissions appear in your dashboard for moderation

### Option B — Collect iframe

For a dedicated section on your page (e.g. “Leave us a review”):

```html
<script src="https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.min.js"></script>
<iframe
  id="testiflow-collect"
  src="https://testiflow.site/collect/YOUR_SITE_ID"
  title="Leave a testimonial"
  style="width:100%;border:0;min-height:640px"
  loading="lazy"
  allow="camera; microphone; autoplay"
></iframe>
<script>
  iFrameResize({ log: false, checkOrigin: false }, '#testiflow-collect');
</script>
```

### Option C — Shareable collection link

Send customers this URL (no embed required):

```
https://testiflow.site/collect/YOUR_SITE_ID
```

### Collect flow types (dashboard)

| Flow | Behavior |
|------|----------|
| `modal` | Centered overlay with blur backdrop |
| `drawer` | Slides in from the right |
| `page` | Full iframe overlay |

Configure under **Configuration → Flow Type**.

---

## Display testimonials

### Option A — Declarative wall (easiest)

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

The script auto-detects the container and renders published testimonials. No extra JavaScript required.

**Data attributes:**

| Attribute | Example | Description |
|-----------|---------|-------------|
| `data-testiflow-wall` | `abc-123-...` | Required — your site ID |
| `data-layout` | `bento` | Layout (see [Layouts](#layouts--themes)) |
| `data-theme` | `dark` | Theme preset |
| `data-limit` | `12` | Max testimonials |

### Option B — JavaScript API

```html
<div id="my-testimonials"></div>
<script src="https://testiflow.site/embed.js" data-site-id="YOUR_SITE_ID" async></script>
<script>
  window.addEventListener('load', function () {
    function init() {
      if (!window.TestimonialWidget) return setTimeout(init, 300);
      var w = new window.TestimonialWidget('YOUR_SITE_ID', 'https://testiflow.site');
      w.displayTestimonials('my-testimonials', {
        layout: 'grid',
        limit: 6,
        showRating: true,
        showAuthor: true
      });
    }
    init();
  });
</script>
```

### Option C — Standalone helper

```html
<div id="wall"></div>
<script src="https://testiflow.site/embed.js" async></script>
<script>
  window.addEventListener('load', function () {
    window.displayTestimonials('YOUR_SITE_ID', 'wall', {
      layout: 'carousel',
      limit: 10,
      apiUrl: 'https://testiflow.site'
    });
  });
</script>
```

---

## Wall of Love (public & SEO)

### Public page

Every site can have a public, indexable wall:

```
https://testiflow.site/w/YOUR_PUBLIC_SLUG
```

Configure in dashboard → **Configuration → Wall of Love**:
- Public URL slug
- Title & subtitle
- Theme & layout
- Public on/off (private walls use `noindex`)

### Iframe embed (auto-resize)

Best for CMS and no-code tools. Copy from **Embed Studio** or use:

```html
<script src="https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.min.js"></script>
<iframe
  id="testiflow-wall"
  src="https://testiflow.site/embed/w/YOUR_SITE_ID?theme=saas&layout=grid"
  title="TestiFlow Wall of Love"
  style="width:100%;border:0;min-height:400px"
  loading="lazy"
  allow="autoplay"
></iframe>
<script>
  iFrameResize({ log: false, checkOrigin: false }, '#testiflow-wall');
</script>
```

**Query parameters:**

| Param | Values |
|-------|--------|
| `theme` | minimal, glass, bold, saas, dark, warm, ocean, sunset |
| `layout` | grid, carousel, marquee, list, bento, masonry, floating, columns |

### SEO features (automatic on public walls)

- Dynamic page title & meta description
- Canonical URL
- Open Graph & Twitter cards
- OG image: `/api/og/w/YOUR_PUBLIC_SLUG`
- JSON-LD structured data (reviews)
- Listed in `/sitemap.xml` when wall is public

---

## Declarative auto-render

Load `embed.js` once; it scans the page for:

```html
<!-- Display wall -->
<div data-testiflow-wall="SITE_ID" data-layout="marquee" data-limit="8"></div>

<!-- Collect button only -->
<div data-testiflow-collect="SITE_ID"></div>

<script src="https://testiflow.site/embed.js" async></script>
```

Multiple widgets on the same page are supported. Dynamic content is detected via `MutationObserver`.

---

## Iframe embeds

| Iframe URL | Purpose |
|------------|---------|
| `/embed/w/{siteId}` | Wall of Love display |
| `/collect/{siteId}` | Collection form |

Always use **iframe-resizer** (included in Embed Studio snippets) to avoid fixed heights and layout shift.

---

## Layouts & themes

### Layouts

| Layout | Description |
|--------|-------------|
| `grid` | Responsive card grid (default) |
| `carousel` | Horizontal scroll with snap |
| `marquee` | Infinite horizontal scroll |
| `list` | Vertical stack |
| `bento` | Asymmetric bento grid |
| `masonry` | Pinterest-style columns |
| `floating` | Stacked floating cards |
| `columns` | Dual scrolling columns |

### Themes

| Theme | Style |
|-------|-------|
| `minimal` | Clean white cards |
| `glass` | Frosted glass on gradient |
| `bold` | Dark high-contrast |
| `saas` | Indigo startup default |
| `dark` | Premium dark mode |
| `warm` | Amber friendly |
| `ocean` | Blue/teal calm |
| `sunset` | Pink/violet gradient |

Set via `data-theme` / `data-layout`, iframe query params, or dashboard **Wall of Love** settings.

---

## React SDK

Package: `packages/react` (publish as `@testiflow/react`).

```bash
npm install @testiflow/react
```

```tsx
'use client';

import { TestiflowWall, TestiflowCarousel, TestiflowMarquee, TestiflowModal } from '@testiflow/react';

export default function Page() {
  return (
    <>
      {/* Wall of Love */}
      <TestiflowWall siteId="YOUR_SITE_ID" layout="bento" theme="saas" limit={12} />

      {/* Collect button */}
      <TestiflowModal siteId="YOUR_SITE_ID" buttonText="Leave a review" />
    </>
  );
}
```

**Props (`TestiflowWall`):**

| Prop | Type | Default |
|------|------|---------|
| `siteId` | string | required |
| `apiBase` | string | current origin |
| `theme` | string | `saas` |
| `layout` | string | `grid` |
| `limit` | number | `12` |
| `className` | string | — |

---

## Platform guides

| Platform | Guide |
|----------|-------|
| WordPress | [/integrations/wordpress](https://testiflow.site/integrations/wordpress) |
| Webflow | [/integrations/webflow](https://testiflow.site/integrations/webflow) |
| Framer | [/integrations/framer](https://testiflow.site/integrations/framer) |
| React | [/integrations/react](https://testiflow.site/integrations/react) |
| Next.js | [/integrations/nextjs](https://testiflow.site/integrations/nextjs) |
| Shopify | [/integrations/shopify](https://testiflow.site/integrations/shopify) |

**WordPress (quick):** Custom HTML block → paste Wall iframe snippet from Embed Studio.

**Webflow (quick):** Embed element → paste iframe code.

**Next.js (quick):** Use `@testiflow/react` or link to `/w/slug` for SEO.

---

## API reference

### Public (no auth)

```http
GET /api/public/walls/{slug}
```

Returns site config + published testimonials for a public wall.

```http
GET /api/testimonials?siteId={siteId}
```

Returns published testimonials (`isPublished: true`).

```http
GET /api/config/{siteId}
```

Returns widget configuration for the embed script.

```http
POST /api/analytics/events
Content-Type: application/json

{
  "siteId": "YOUR_SITE_ID",
  "eventType": "wall_view",
  "properties": {},
  "metadata": { "pageUrl": "https://yoursite.com" }
}
```

### Authenticated (Bearer token)

Used by the dashboard. Include header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sites` | GET, POST | List / create sites |
| `/api/sites/{siteId}` | GET, PUT, DELETE | Site CRUD |
| `/api/testimonials?siteId=&all=true` | GET | All testimonials (incl. drafts) |
| `/api/testimonials/{id}` | PUT | Publish / update |
| `/api/analytics/stats?siteId=` | GET | Dashboard analytics |
| `/api/ai/enrich` | POST | AI summary, tags, sentiment |

---

## Analytics events

| Event | When |
|-------|------|
| `button_view` | Collect button rendered |
| `button_click` | User opens form |
| `testimonial_submitted` | Submission received |
| `wall_view` | Public/embed wall viewed |
| `widget_impression` | Widget enters viewport |

View aggregates in dashboard → **Analytics** tab.

---

## AI enrichment

Optional. Set `OPENAI_API_KEY` in server environment.

```http
POST /api/ai/enrich
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{ "testimonialId": "MONGODB_ID" }
```

Returns summary, headline, sentiment, and tags (support, roi, growth, reliability, etc.). Without OpenAI, heuristic fallback is used.

---

## Content Security Policy (CSP)

If embeds are blocked, add to your `<head>`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'self' 'unsafe-inline' https://testiflow.site https://cdn.jsdelivr.net;
           connect-src 'self' https://testiflow.site;
           frame-src https://testiflow.site;"
/>
```

Adjust for your CDN and Cloudinary video domains if needed.

---

## Troubleshooting

### Button not appearing

1. Confirm **Enable Button** is on in dashboard
2. Check `data-site-id` matches your site ID
3. Open DevTools → Console for errors
4. Verify `embed.js` loads (Network tab)

### Testimonials not showing on website

1. **Publish** testimonials in dashboard (not just save as draft)
2. Confirm `siteId` is correct
3. For declarative embed, ensure `data-testiflow-wall` is set
4. Wait 1–2s after page load for script init

### Iframe height wrong

Use the **iframe-resizer** snippet from Embed Studio (do not use a fixed `height="800"`).

### Wall not in Google

1. Enable **Public wall** in settings
2. Set a clean **public slug**
3. Ensure at least one published testimonial
4. Submit sitemap: `https://testiflow.site/sitemap.xml`

### Duplicate testimonials on page

- Use declarative embed **once** per container
- Clear container before `displayTestimonials` if using JS API
- Avoid calling `displayTestimonials` multiple times without guard

### Video recording not working

- Iframe collect embed needs `allow="camera; microphone; autoplay"`
- Site must be served over **HTTPS**

---

## Complete HTML example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Our Customers</title>
</head>
<body>
  <h1>What customers say</h1>

  <!-- Wall of Love -->
  <div
    data-testiflow-wall="YOUR_SITE_ID"
    data-layout="grid"
    data-theme="saas"
    data-limit="12"
  >
  </div>

  <!-- Collect testimonials -->
  <script
    src="https://testiflow.site/embed.js"
    data-site-id="YOUR_SITE_ID"
    async
  ></script>
</body>
</html>
```

---

## Support & links

- **Product:** [testiflow.site](https://testiflow.site)
- **Docs:** [testiflow.site/docs](https://testiflow.site/docs)
- **In-app guide:** [testiflow.site/integration-guide](https://testiflow.site/integration-guide)

---

*Last updated: TestiFlow embed v2 — Wall of Love, declarative embeds, React SDK, dynamic SEO.*
