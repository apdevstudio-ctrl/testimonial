'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type TestiflowLayout =
  | 'grid'
  | 'carousel'
  | 'marquee'
  | 'list'
  | 'bento'
  | 'masonry'
  | 'floating'
  | 'columns';

export type TestiflowTheme =
  | 'saas'
  | 'minimal'
  | 'dark'
  | 'glass'
  | 'ocean'
  | 'bold'
  | 'warm'
  | 'mono';

export interface TestiflowWallProps {
  siteId: string;
  apiBase?: string;
  theme?: TestiflowTheme;
  layout?: TestiflowLayout;
  limit?: number;
  className?: string;
  loadingFallback?: React.ReactNode;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

function useApiBase(override?: string) {
  return override || (typeof window !== 'undefined' ? window.location.origin : 'https://testiflow.site');
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

export function TestiflowWall({
  siteId,
  apiBase,
  theme = 'saas',
  layout = 'grid',
  limit = 12,
  className = '',
  loadingFallback,
  onReady,
  onError,
}: TestiflowWallProps) {
  const ref = useRef<HTMLDivElement>(null);
  const base = useApiBase(apiBase);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const mount = useCallback(async () => {
    const el = ref.current;
    if (!el) return;
    try {
      el.setAttribute('data-testiflow-wall', siteId);
      el.setAttribute('data-theme', theme);
      el.setAttribute('data-layout', layout);
      el.setAttribute('data-limit', String(limit));
      const src = `${base.replace(/\/$/, '')}/embed.js`;
      await loadScript(src);
      setStatus('ready');
      onReady?.();
    } catch (e) {
      setStatus('error');
      onError?.(e instanceof Error ? e : new Error('TestiFlow embed failed'));
    }
  }, [siteId, base, theme, layout, limit, onReady, onError]);

  useEffect(() => {
    mount();
  }, [mount]);

  if (status === 'loading' && loadingFallback) {
    return <>{loadingFallback}</>;
  }

  if (status === 'error') {
    return (
      <div className={`text-sm text-red-600 p-4 border border-red-200 rounded-lg ${className}`} role="alert">
        Could not load TestiFlow widget. Check your site ID and network.
      </div>
    );
  }

  return (
    <div ref={ref} className={className} data-testiflow-status={status} aria-busy={status === 'loading'} />
  );
}

export function TestiflowCarousel(props: TestiflowWallProps) {
  return <TestiflowWall {...props} layout="carousel" />;
}

export function TestiflowMarquee(props: TestiflowWallProps) {
  return <TestiflowWall {...props} layout="marquee" />;
}

export interface TestiflowModalProps {
  siteId: string;
  apiBase?: string;
  buttonText?: string;
  className?: string;
}

export function TestiflowModal({
  siteId,
  apiBase,
  buttonText = 'Leave a testimonial',
  className = '',
}: TestiflowModalProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const base = useApiBase(apiBase);

  useEffect(() => {
    const src = `${base.replace(/\/$/, '')}/embed.js`;
    loadScript(src)
      .then(() => setReady(true))
      .catch(() => setError(true));
  }, [siteId, base]);

  if (error) {
    return <span className="text-sm text-red-600">Collect button unavailable</span>;
  }

  return (
    <button
      type="button"
      disabled={!ready}
      className={`px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 ${className}`}
      data-testiflow-collect={siteId}
    >
      {ready ? buttonText : 'Loading…'}
    </button>
  );
}

export { TestiflowWall as default };
