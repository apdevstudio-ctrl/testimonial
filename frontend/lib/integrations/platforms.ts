export interface IntegrationPlatform {
  slug: string;
  name: string;
  icon: string;
  headline: string;
  description: string;
  steps: { title: string; body: string }[];
  tips?: string[];
}

export const INTEGRATION_PLATFORMS: IntegrationPlatform[] = [
  {
    slug: 'wordpress',
    name: 'WordPress',
    icon: '📝',
    headline: 'Add testimonials to WordPress in 2 minutes',
    description:
      'Embed a Wall of Love or collection button on any WordPress page using a Custom HTML block or your theme footer.',
    steps: [
      { title: 'Copy your embed code', body: 'In TestiFlow dashboard → your site → Embed Studio, copy the Wall iframe or script snippet.' },
      { title: 'Edit your page', body: 'Open the page in WordPress and add a Custom HTML block where testimonials should appear.' },
      { title: 'Paste & publish', body: 'Paste the embed code, preview, and publish. Use iframe embed for zero conflicts with themes.' },
    ],
    tips: ['Use a child theme for footer-wide embeds', 'Clear cache plugins after publishing'],
  },
  {
    slug: 'webflow',
    name: 'Webflow',
    icon: '🎨',
    headline: 'Embed testimonials on Webflow',
    description:
      'Drop TestiFlow into any Webflow section with an Embed element—perfect for marketing sites and landing pages.',
    steps: [
      { title: 'Add Embed element', body: 'In the Webflow Designer, drag an Embed element into your section.' },
      { title: 'Paste embed code', body: 'Paste your Wall of Love iframe code from TestiFlow Embed Studio.' },
      { title: 'Publish', body: 'Publish your site. The iframe auto-resizes to fit your testimonials.' },
    ],
  },
  {
    slug: 'framer',
    name: 'Framer',
    icon: '✨',
    headline: 'Testimonials for Framer sites',
    description:
      'Use Framer\'s embed component to add a responsive Wall of Love that matches your brand.',
    steps: [
      { title: 'Insert embed', body: 'Add an Embed component to your Framer canvas.' },
      { title: 'Paste iframe code', body: 'Use the auto-resizing iframe snippet from TestiFlow.' },
      { title: 'Style the frame', body: 'Set width to 100% and let iframe-resizer handle height.' },
    ],
  },
  {
    slug: 'react',
    name: 'React',
    icon: '⚛️',
    headline: 'React testimonial widget integration',
    description:
      'Load TestiFlow via script tag or iframe. Full React SDK coming soon—iframe works in any CRA or Vite app today.',
    steps: [
      { title: 'Add script to index.html', body: 'Place the embed.js script in public/index.html or use useEffect to inject it.' },
      { title: 'Mount display', body: 'Call TestimonialWidget.displayTestimonials(containerId, options) after load.' },
      { title: 'Or use iframe', body: 'For isolation, embed /embed/w/{siteId} in a React iframe component.' },
    ],
  },
  {
    slug: 'nextjs',
    name: 'Next.js',
    icon: '▲',
    headline: 'Next.js testimonial embed',
    description:
      'Embed testimonials in App Router or Pages Router with a client component and dynamic iframe.',
    steps: [
      { title: 'Create a client component', body: 'Use next/script for embed.js or an iframe pointing to /embed/w/[siteId].' },
      { title: 'Add to page', body: 'Import the component into your marketing or product page.' },
      { title: 'SEO wall page', body: 'Link to your public Wall at testiflow.site/w/your-slug for indexable social proof.' },
    ],
  },
  {
    slug: 'shopify',
    name: 'Shopify',
    icon: '🛒',
    headline: 'Shopify testimonial widget',
    description:
      'Add social proof to product and home pages via theme custom Liquid or the custom HTML section.',
    steps: [
      { title: 'Theme editor', body: 'Online Store → Themes → Customize → add Custom Liquid or HTML section.' },
      { title: 'Paste embed', body: 'Use Wall iframe embed for best compatibility with Shopify themes.' },
      { title: 'Product pages', body: 'Add a smaller carousel embed near the buy button to boost conversions.' },
    ],
  },
];

export function getPlatform(slug: string): IntegrationPlatform | undefined {
  return INTEGRATION_PLATFORMS.find((p) => p.slug === slug);
}
