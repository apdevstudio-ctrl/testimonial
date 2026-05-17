/**
 * Premium modal & drawer overlays for TestiFlow collect flow
 */

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const OVERLAY_STYLES = `
  @keyframes tfFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes tfSlideUp { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes tfSlideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .tf-overlay-root { font-family: system-ui, -apple-system, sans-serif; }
  .tf-modal-panel { animation: ${REDUCED_MOTION ? 'none' : 'tfSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)'}; }
  .tf-drawer-panel { animation: ${REDUCED_MOTION ? 'none' : 'tfSlideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'}; }
`;

function trapFocus(container: HTMLElement): () => void {
  const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(sel));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}

export function injectOverlayStyles(): void {
  if (document.getElementById('testiflow-overlay-styles')) return;
  const style = document.createElement('style');
  style.id = 'testiflow-overlay-styles';
  style.textContent = OVERLAY_STYLES;
  document.head.appendChild(style);
}

export interface OverlayOptions {
  onClose: () => void;
  content: HTMLElement;
  ariaLabel?: string;
}

export function openPremiumModal(opts: OverlayOptions): HTMLElement {
  injectOverlayStyles();
  const overlay = document.createElement('div');
  overlay.className = 'tf-overlay-root';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', opts.ariaLabel || 'Leave a testimonial');
  overlay.id = 'testimonial-modal';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 1000000;
    display: flex; align-items: center; justify-content: center; padding: 16px;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    animation: ${REDUCED_MOTION ? 'none' : 'tfFadeIn 0.25s ease-out'};
  `;

  const panel = document.createElement('div');
  panel.className = 'tf-modal-panel';
  panel.style.cssText = `
    position: relative; width: 100%; max-width: 520px; max-height: 90vh;
    overflow: auto; border-radius: 16px;
    background: #fff; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05);
  `;
  panel.appendChild(opts.content);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute; top: 12px; right: 12px; width: 36px; height: 36px;
    border: none; border-radius: 8px; background: #f4f4f5; color: #18181b;
    font-size: 22px; cursor: pointer; line-height: 1; z-index: 2;
    transition: background 0.15s;
  `;
  closeBtn.onmouseenter = () => { closeBtn.style.background = '#e4e4e7'; };
  closeBtn.onmouseleave = () => { closeBtn.style.background = '#f4f4f5'; };

  const close = () => {
    overlay.remove();
    document.body.style.overflow = '';
    opts.onClose();
  };
  closeBtn.onclick = close;
  overlay.onclick = (e) => { if (e.target === overlay) close(); };
  panel.insertBefore(closeBtn, panel.firstChild);

  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const onEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onEsc);
    }
  };
  document.addEventListener('keydown', onEsc);
  const untrap = trapFocus(panel);
  closeBtn.focus();

  const origClose = close;
  overlay.dataset.tfClose = '1';
  (overlay as any)._tfCleanup = () => {
    document.removeEventListener('keydown', onEsc);
    untrap();
    origClose();
  };

  return overlay;
}

export function openPremiumDrawer(opts: OverlayOptions): HTMLElement {
  injectOverlayStyles();
  const overlay = document.createElement('div');
  overlay.className = 'tf-overlay-root';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.id = 'testimonial-drawer-backdrop';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 1000000;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
    animation: ${REDUCED_MOTION ? 'none' : 'tfFadeIn 0.2s ease'};
  `;

  const drawer = document.createElement('div');
  drawer.className = 'tf-drawer-panel';
  drawer.id = 'testimonial-drawer';
  drawer.style.cssText = `
    position: fixed; top: 0; right: 0; width: min(420px, 100vw); height: 100%;
    background: #fff; box-shadow: -8px 0 40px rgba(0,0,0,0.12);
    overflow-y: auto; z-index: 1000001;
  `;
  drawer.appendChild(opts.content);

  const close = () => {
    overlay.remove();
    drawer.remove();
    document.body.style.overflow = '';
    opts.onClose();
  };
  overlay.onclick = close;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  document.body.style.overflow = 'hidden';

  const onEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onEsc);
    }
  };
  document.addEventListener('keydown', onEsc);
  trapFocus(drawer);

  return drawer;
}
