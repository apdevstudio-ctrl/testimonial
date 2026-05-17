'use client';

import { useEffect, useRef } from 'react';
import WallOfLove, { type WallTestimonial } from './WallOfLove';
import type { WidgetCustomizeConfig } from '@/lib/widget/customizer';
import { mergeCustomize } from '@/lib/widget/customizer';
import type { WidgetThemePreset } from '@/lib/widgetThemes';

interface WallViewerProps {
  siteId: string;
  testimonials: WallTestimonial[];
  themePreset?: WidgetThemePreset;
  layout?: WidgetCustomizeConfig['layout'];
  title?: string;
  subtitle?: string;
  columns?: number;
  compact?: boolean;
  customize?: Partial<WidgetCustomizeConfig>;
  trackViews?: boolean;
}

export default function WallViewer({
  siteId,
  testimonials,
  themePreset,
  layout,
  title,
  subtitle,
  columns,
  compact,
  customize,
  trackViews = true,
}: WallViewerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);
  const config = mergeCustomize({ ...customize, themePreset, layout });

  useEffect(() => {
    if (!trackViews || !ref.current || tracked.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !tracked.current) {
          tracked.current = true;
          fetch('/api/analytics/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              siteId,
              eventType: 'wall_view',
              properties: { layout: config.layout, source: 'wall_viewer' },
              metadata: {
                pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
              },
            }),
          }).catch(() => {});
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [siteId, trackViews, config.layout]);

  return (
    <div ref={ref} className="tf-wall-viewer min-h-0">
      <WallOfLove
        testimonials={testimonials}
        themePreset={config.themePreset}
        layout={config.layout}
        title={title}
        subtitle={subtitle}
        columns={columns}
        compact={compact}
        customize={config}
      />
    </div>
  );
}
