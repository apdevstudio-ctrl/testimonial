/** Shared copy for /integration-guide page */

export const FEATURES_LIST = [
  {
    title: 'Collect',
    items: [
      'Video & text testimonials',
      'Modal, drawer, or page flow',
      'Shareable /collect link',
      'Custom form & branding',
    ],
  },
  {
    title: 'Display',
    items: [
      'Wall of Love (public SEO URL)',
      '8 layouts & 8 themes',
      'Declarative data-testiflow-wall',
      'Iframe auto-resize embeds',
    ],
  },
  {
    title: 'Developer',
    items: ['embed.js / script.js', '@testiflow/react SDK', 'Public REST API', 'Analytics events'],
  },
];

export function scriptCollect(siteId: string, base: string) {
  return `<script src="${base}/embed.js" data-site-id="${siteId}" async></script>`;
}

export function declarativeWall(siteId: string, base: string) {
  return `<div
  data-testiflow-wall="${siteId}"
  data-layout="grid"
  data-theme="saas"
  data-limit="12"
>
</div>
<script src="${base}/embed.js" async></script>`;
}

export function wallIframe(siteId: string, base: string) {
  return `<script src="https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.min.js"></script>
<iframe
  id="testiflow-wall"
  src="${base}/embed/w/${siteId}?theme=saas&layout=grid"
  title="TestiFlow Wall of Love"
  style="width:100%;border:0;min-height:400px"
  loading="lazy"
></iframe>
<script>iFrameResize({ log: false, checkOrigin: false }, '#testiflow-wall');</script>`;
}

export function reactExample(siteId: string) {
  return `import { TestiflowWall } from '@testiflow/react';

export default function Page() {
  return <TestiflowWall siteId="${siteId}" layout="bento" theme="saas" limit={12} />;
}`;
}

export const LAYOUTS = [
  'grid',
  'carousel',
  'marquee',
  'list',
  'bento',
  'masonry',
  'floating',
  'columns',
] as const;

export const THEMES = [
  'minimal',
  'glass',
  'bold',
  'saas',
  'dark',
  'warm',
  'ocean',
  'sunset',
] as const;
