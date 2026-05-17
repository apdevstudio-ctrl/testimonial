/**
 * Declarative auto-render: [data-testiflow-wall], [data-testiflow-collect]
 */

export interface AutoRenderOptions {
  apiUrl: string;
  TestimonialWidget: new (siteId: string, apiUrl?: string) => {
    displayTestimonials: (
      containerId: string,
      opts: Record<string, unknown>
    ) => Promise<void>;
  };
}

function detectApiUrl(): string {
  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    const src = scripts[i].src;
    if (src && (src.includes('embed.js') || src.includes('script.js'))) {
      return src.replace(/\/embed\.js.*$/, '').replace(/\/script\.js.*$/, '');
    }
  }
  return window.location.origin;
}

export function initAutoRender(opts: AutoRenderOptions): void {
  const apiUrl = opts.apiUrl || detectApiUrl();

  const wallNodes = document.querySelectorAll<HTMLElement>('[data-testiflow-wall]');
  wallNodes.forEach((el, index) => {
    if (el.dataset.testiflowRendered === 'true') return;
    const siteId = el.dataset.testiflowWall;
    if (!siteId) return;

    el.dataset.testiflowRendered = 'true';
    if (!el.id) el.id = `testiflow-wall-${siteId.slice(0, 8)}-${index}`;

    const widget = new opts.TestimonialWidget(siteId, apiUrl);
    const layout = (el.dataset.layout || el.dataset.testiflowLayout || 'grid') as string;
    const limit = parseInt(el.dataset.limit || el.dataset.testiflowLimit || '12', 10);

    widget.displayTestimonials(el.id, {
      layout,
      limit: isNaN(limit) ? 12 : limit,
      showRating: true,
      showAuthor: true,
    });
  });

  const collectNodes = document.querySelectorAll<HTMLElement>('[data-testiflow-collect]');
  collectNodes.forEach((el) => {
    const siteId = el.dataset.testiflowCollect;
    if (!siteId || el.dataset.testiflowRendered === 'true') return;
    el.dataset.testiflowRendered = 'true';
    new opts.TestimonialWidget(siteId, apiUrl);
  });
}

export function observeAutoRender(opts: AutoRenderOptions): void {
  initAutoRender(opts);
  if (typeof MutationObserver === 'undefined') return;
  const observer = new MutationObserver(() => initAutoRender(opts));
  observer.observe(document.body, { childList: true, subtree: true });
}
