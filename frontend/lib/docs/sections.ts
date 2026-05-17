export interface DocSection {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export const DOC_SECTIONS: DocSection[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'Create your first site and embed TestiFlow in minutes.',
    content: `## Quick start

TestiFlow helps you collect video and text testimonials, moderate them in a dashboard, and embed beautiful social proof on any website.

### Create an account

1. Sign up at testiflow.site/signup
2. Open the **Dashboard** and click **Create site**
3. Note your **Site ID** — you will use it in every embed snippet

### Publish testimonials

1. Add the collect script to your site (see Embed Guide)
2. Customers submit testimonials via modal, drawer, or collect page
3. In the dashboard, open **Testimonials** → **Publish** for each review you want public

### Display on your site

Use a declarative wall embed — no extra JavaScript required:

\`\`\`html
<div
  data-testiflow-wall="YOUR_SITE_ID"
  data-layout="grid"
  data-theme="saas"
  data-limit="12"
></div>
<script src="https://testiflow.site/embed.js" async></script>
\`\`\`

### Public Wall of Love (SEO)

Every site gets a shareable page at \`/w/your-slug\` with dynamic metadata, Open Graph images, and JSON-LD for search engines. Set your slug under **Configuration → Wall of Love**.

### Next steps

- Try the **Interactive playground** to preview themes and layouts
- Read the **Embed Guide** for iframe and React options
- Browse **Examples** for preset demos`,
  },
  {
    slug: 'embed-guide',
    title: 'Embed Guide',
    description: 'Script, iframe, and Wall of Love integration patterns.',
    content: `## Embed types

TestiFlow supports three main integration patterns. Pick the one that fits your stack.

### 1. Script collect (floating button)

Adds a floating **Give Testimonial** button. Configure position, colors, and flow (modal / drawer / page) in the dashboard.

\`\`\`html
<script
  src="https://testiflow.site/embed.js"
  data-site-id="YOUR_SITE_ID"
  async
></script>
\`\`\`

### 2. Declarative wall (display only)

Renders published testimonials into any container. Supports \`data-layout\`, \`data-theme\`, and \`data-limit\`.

\`\`\`html
<div data-testiflow-wall="YOUR_SITE_ID" data-layout="bento" data-theme="glass"></div>
<script src="https://testiflow.site/embed.js" async></script>
\`\`\`

### 3. Iframe embed (auto-resize)

Best for WordPress, Webflow, or CMS block editors. Copy the snippet from **Embed Studio** — it includes iframe-resizer so height adjusts automatically.

## Embed Studio

In your site dashboard, **Embed Studio** provides three tabs:

- **Collect** — script or collect-page iframe
- **Wall of Love** — public wall iframe with theme/layout query params
- **Display** — programmatic display API for legacy integrations

## Tips

- Always **publish** testimonials before expecting them in widgets
- Use \`async\` on the script tag to avoid blocking page load
- For CSP, allow \`script-src\` and \`frame-src\` for your TestiFlow domain`,
  },
  {
    slug: 'react-sdk',
    title: 'React SDK',
    description: '@testiflow/react components for Next.js and React apps.',
    content: `## Install

\`\`\`bash
npm install @testiflow/react
\`\`\`

## Wall of Love component

\`\`\`tsx
'use client';

import { TestiflowWall } from '@testiflow/react';

export function Reviews() {
  return (
    <TestiflowWall
      siteId="YOUR_SITE_ID"
      theme="saas"
      layout="bento"
      limit={12}
      loadingFallback={<p>Loading reviews…</p>}
      onReady={() => console.log('ready')}
    />
  );
}
\`\`\`

## Other components

- \`TestiflowCarousel\` — carousel layout preset
- \`TestiflowMarquee\` — scrolling marquee strip
- \`TestiflowModal\` — collect button that opens the submission flow

## Next.js App Router

Mark client components with \`"use client"\`. For SEO-critical pages, prefer the public wall URL or server-fetch \`GET /api/public/walls/[slug]\` and render with your own markup.

## TypeScript

Exported types: \`TestiflowLayout\`, \`TestiflowTheme\`, \`TestiflowWallProps\`.`,
  },
  {
    slug: 'nextjs',
    title: 'Next.js Guide',
    description: 'App Router integration with SSR-safe walls.',
    content: `## Recommended approach

### Client-side widget

Use \`@testiflow/react\` in a client component for dashboard-style embeds on marketing pages:

\`\`\`tsx
'use client';
import { TestiflowWall } from '@testiflow/react';

export function SocialProof() {
  return <TestiflowWall siteId={process.env.NEXT_PUBLIC_TESTIFLOW_SITE_ID!} layout="grid" />;
}
\`\`\`

### SEO public wall

Link to your hosted wall for maximum SEO benefit:

\`\`\`
https://testiflow.site/w/your-public-slug
\`\`\`

Or fetch JSON server-side:

\`\`\`ts
const res = await fetch(\`\${process.env.NEXT_PUBLIC_SITE_URL}/api/public/walls/my-slug\`, {
  next: { revalidate: 3600 },
});
const data = await res.json();
\`\`\`

### Environment variables

- \`NEXT_PUBLIC_APP_URL\` — your app origin for redirects
- Site ID is per-site from the dashboard, not a global env var`,
  },
  {
    slug: 'api',
    title: 'API Reference',
    description: 'Public and authenticated REST endpoints.',
    content: `## Public endpoints

### GET /api/public/walls/[slug]

Returns published testimonials and wall settings for a public slug. No auth required. Used by public wall pages and OG image generation.

### GET /api/config/[siteId]

Widget configuration for embed script (button, theme, features).

## Authenticated endpoints

Require \`Authorization: Bearer <token>\` from sign-in.

### Testimonials

- \`GET /api/testimonials?siteId=\` — list (add \`&all=true\` for admin draft view)
- \`PUT /api/testimonials/[id]\` — update publish status, metadata

### Analytics

- \`GET /api/analytics/stats?siteId=\` — aggregated metrics
- \`POST /api/analytics/events\` — track button views, wall views, submissions

### AI enrichment

- \`POST /api/ai/enrich\` — body: \`{ "testimonialId": "..." }\` — adds headline, tags, sentiment

### Sites

- \`GET /api/sites\` — list sites
- \`GET /api/sites/[siteId]\` — site detail
- \`PUT /api/sites/[siteId]\` — update config, wall settings, widget customization`,
  },
  {
    slug: 'webhooks',
    title: 'Webhooks',
    description: 'Event notifications for automation.',
    content: `## Status

Webhook delivery for testimonial lifecycle events is on the roadmap.

### Planned events

- \`testimonial.submitted\` — new submission pending moderation
- \`testimonial.published\` — approved and visible on widgets
- \`testimonial.unpublished\` — removed from public display

### Workaround today

Poll \`GET /api/testimonials?siteId=&all=true\` on a schedule, or use the dashboard email notifications when available.

Contact support if you need early access for Zapier or Make.com integrations.`,
  },
  {
    slug: 'themes',
    title: 'Themes',
    description: '8 preset themes and customization tokens.',
    content: `## Built-in themes

- **saas** — default product marketing sites
- **minimal** — clean, typography-focused brands
- **glass** — frosted cards over gradients
- **bold** — high-contrast hero sections
- **dark** — dark mode landing pages
- **warm** — friendly consumer brands
- **ocean** — cool-toned B2B SaaS
- **sunset** — warm gradients and accents

Set via \`data-theme="glass"\` on the wall container or in the **Visual embed customizer** in your dashboard.

## Customization

The dashboard customizer controls:

- Border radius and card shadow
- Spacing between cards
- Animation style (subtle, spring, glow)
- Hide "Powered by TestiFlow" branding

Saved to \`widgetCustomization\` on your site model and applied to iframe embeds.`,
  },
  {
    slug: 'layouts',
    title: 'Layouts',
    description: 'Grid, carousel, marquee, bento, masonry, and more.',
    content: `## Available layouts

- **grid** — responsive card grid (default)
- **carousel** — horizontal scroll with snap points
- **marquee** — infinite scrolling strip
- **list** — single-column stacked cards
- **bento** — asymmetric highlight grid
- **masonry** — Pinterest-style columns
- **floating** — stacked offset cards
- **columns** — dual auto-scrolling columns

Set via \`data-layout="bento"\` or the playground / customizer.

## Choosing a layout

- **Landing hero** → bento or carousel
- **Footer social proof** → marquee or columns
- **Dedicated reviews page** → grid or masonry
- **Sidebar widget** → list

Preview all layouts in the **Interactive playground** or at \`/examples\`.`,
  },
  {
    slug: 'seo',
    title: 'SEO',
    description: 'Indexable walls, sitemap, OG images, and structured data.',
    content: `## Public Wall of Love

Each site can expose \`/w/{publicSlug}\` with:

- Dynamic \`<title>\` and meta description from wall settings
- Open Graph and Twitter card tags
- Auto-generated OG image at \`/api/og/w/{slug}\`
- JSON-LD \`ItemList\` / Review schema for rich results

## Sitemap

Public walls are included in \`/sitemap.xml\` (revalidated hourly). Ensure **Wall of Love → Public** is enabled in site configuration.

## Best practices

1. Use a descriptive slug (e.g. \`acme-customer-reviews\`)
2. Set a compelling wall title and subtitle in the dashboard
3. Publish at least 5–10 testimonials before sharing
4. Link to your wall from footer "Reviews" or "Customers" nav items`,
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common embed, CSP, and dashboard issues.',
    content: `## Widget not showing

1. Confirm **Site ID** matches your dashboard site
2. Check testimonials are **Published**, not draft
3. Open browser DevTools → Network — verify \`embed.js\` loads (200)
4. Ensure the wall container exists before the script runs (or use \`async\`)

## Empty wall

- No published testimonials for that site
- Wrong site ID in \`data-testiflow-wall\`
- API blocked by ad blocker (rare)

## Video upload fails

Configure Cloudinary env vars: \`CLOUDINARY_CLOUD_NAME\`, \`CLOUDINARY_API_KEY\`, \`CLOUDINARY_API_SECRET\`.

## Content Security Policy

Add to your CSP:

- \`script-src\` — your TestiFlow domain
- \`frame-src\` — for iframe embeds
- \`connect-src\` — for API calls from the script

## Build errors on Windows / OneDrive

If \`next build\` fails with \`EINVAL readlink\` on \`.next\`, delete \`frontend/.next\` and rebuild. Consider moving the project outside OneDrive sync.

## Still stuck?

See the full **Integration guide** at \`/integration-guide\` or contact support.`,
  },
];
