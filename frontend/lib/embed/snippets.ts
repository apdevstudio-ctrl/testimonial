import type { WidgetThemePreset } from '@/lib/widgetThemes';

export type EmbedType = 'script' | 'wall-iframe' | 'collect-iframe' | 'display-script';

export interface EmbedOptions {
  baseUrl: string;
  siteId: string;
  publicSlug?: string;
  theme?: WidgetThemePreset;
  layout?: 'grid' | 'carousel' | 'marquee' | 'list';
  limit?: number;
}

const IFRAME_RESIZER_CDN =
  'https://cdn.jsdelivr.net/npm/iframe-resizer@4.3.9/js/iframeResizer.min.js';

export function getScriptEmbed({ baseUrl, siteId }: EmbedOptions): string {
  return `<script src="${baseUrl}/embed.js" data-site-id="${siteId}" async></script>`;
}

export function getDisplayScriptEmbed({
  baseUrl,
  siteId,
  layout = 'grid',
  limit = 6,
}: EmbedOptions): string {
  return `<!-- TestiFlow: display testimonials -->
<script src="${baseUrl}/embed.js" data-site-id="${siteId}" async></script>
<div id="testiflow-wall"></div>
<script>
  window.addEventListener('load', function () {
    var tries = 0;
    function run() {
      if (!window.TestimonialWidget && tries++ < 20) return setTimeout(run, 300);
      var w = new window.TestimonialWidget('${siteId}', '${baseUrl}');
      w.displayTestimonials('testiflow-wall', {
        layout: '${layout}',
        limit: ${limit},
        showRating: true,
        showAuthor: true
      });
    }
    run();
  });
</script>`;
}

export function getWallIframeEmbed(opts: EmbedOptions): string {
  const { baseUrl, siteId, theme = 'saas', layout = 'grid' } = opts;
  const iframeId = `testiflow-wall-${siteId.slice(0, 8)}`;
  const src = `${baseUrl}/embed/w/${siteId}?theme=${theme}&layout=${layout}`;
  return `<script src="${IFRAME_RESIZER_CDN}"></script>
<iframe
  id="${iframeId}"
  src="${src}"
  title="TestiFlow Wall of Love"
  style="width:100%;border:0;min-height:400px"
  loading="lazy"
  allow="autoplay"
></iframe>
<script>
  iFrameResize({ log: false, checkOrigin: false }, '#${iframeId}');
</script>`;
}

export function getCollectIframeEmbed(opts: EmbedOptions): string {
  const { baseUrl, siteId } = opts;
  const iframeId = `testiflow-collect-${siteId.slice(0, 8)}`;
  const src = `${baseUrl}/collect/${siteId}`;
  return `<script src="${IFRAME_RESIZER_CDN}"></script>
<iframe
  id="${iframeId}"
  src="${src}"
  title="Leave a testimonial"
  style="width:100%;border:0;min-height:640px"
  loading="lazy"
  allow="camera; microphone; autoplay"
></iframe>
<script>
  iFrameResize({ log: false, checkOrigin: false }, '#${iframeId}');
</script>`;
}

export function getPublicWallUrl(baseUrl: string, slug: string): string {
  return `${baseUrl}/w/${slug}`;
}

export function getCollectUrl(baseUrl: string, siteId: string): string {
  return `${baseUrl}/collect/${siteId}`;
}

export function slugifySiteName(name: string, siteId: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return base ? `${base}-${siteId.slice(0, 8)}` : siteId.slice(0, 12);
}
