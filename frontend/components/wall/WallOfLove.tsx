'use client';

import { WIDGET_THEME_PRESETS, type WidgetThemePreset } from '@/lib/widgetThemes';
import type { WidgetCustomizeConfig } from '@/lib/widget/customizer';
import { mergeCustomize, shadowCss } from '@/lib/widget/customizer';

export interface WallTestimonial {
  _id: string;
  type: 'video' | 'text';
  text?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  rating?: number;
  verified?: boolean;
  sourceLabel?: string;
  ai?: { headline?: string; tags?: string[] };
  author?: {
    name?: string;
    company?: string;
    position?: string;
    avatar?: string;
  };
  createdAt?: string;
}

interface WallOfLoveProps {
  testimonials: WallTestimonial[];
  themePreset?: WidgetThemePreset;
  layout?: WidgetCustomizeConfig['layout'];
  title?: string;
  subtitle?: string;
  columns?: number;
  compact?: boolean;
  customize?: Partial<WidgetCustomizeConfig>;
}

function Stars({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= rating ? color : '#d4d4d8' }}>
          ★
        </span>
      ))}
    </div>
  );
}

function TrustBadges({ t, muted }: { t: WallTestimonial; muted: string }) {
  if (!t.verified && !t.sourceLabel) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {t.verified && (
        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          Verified
        </span>
      )}
      {t.sourceLabel && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600" style={{ color: muted }}>
          {t.sourceLabel}
        </span>
      )}
    </div>
  );
}

function TestimonialCard({
  t,
  theme,
  customize,
  className = '',
}: {
  t: WallTestimonial;
  theme: (typeof WIDGET_THEME_PRESETS)[WidgetThemePreset];
  customize?: WidgetCustomizeConfig;
  className?: string;
}) {
  const initials = (t.author?.name || 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const radius = customize ? `${customize.borderRadius}px` : theme.borderRadius;
  const shadow = customize ? shadowCss(customize.shadow) : theme.cardShadow;
  const animClass =
    customize?.animationStyle === 'spring'
      ? 'tf-anim-spring'
      : customize?.animationStyle === 'glow'
        ? 'tf-anim-glow'
        : customize?.animationStyle === 'subtle'
          ? 'tf-anim-subtle'
          : '';

  return (
    <article
      className={`tf-wall-card tf-card-hover ${animClass} ${className}`}
      style={{
        background: theme.cardBackground,
        color: theme.textColor,
        borderRadius: radius,
        boxShadow: shadow,
        border: '1px solid rgba(128,128,128,0.15)',
        padding: customize ? `${customize.spacing}px` : '1.25rem',
        backdropFilter: theme.id === 'glass' ? 'blur(12px)' : undefined,
      }}
    >
      <TrustBadges t={t} muted={theme.mutedColor} />
      {t.rating != null && t.rating > 0 && (
        <div className="mb-3">
          <Stars rating={Math.round(t.rating)} color={theme.primaryColor} />
        </div>
      )}
      {t.type === 'video' && t.videoUrl && (
        <div className="mb-3 rounded-lg overflow-hidden aspect-video bg-black/10">
          <video
            src={t.videoUrl}
            controls
            playsInline
            preload="none"
            poster={t.videoThumbnail}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {(t.ai?.headline || t.text) && (
        <p className="text-[15px] leading-relaxed mb-4" style={{ color: theme.textColor }}>
          &ldquo;{t.ai?.headline || t.text}&rdquo;
        </p>
      )}
      <footer className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          style={{ background: theme.primaryColor, color: '#fff' }}
        >
          {initials}
        </div>
        <div>
          <div className="font-semibold text-sm">{t.author?.name || 'Anonymous'}</div>
          {(t.author?.position || t.author?.company) && (
            <div className="text-xs" style={{ color: theme.mutedColor }}>
              {[t.author?.position, t.author?.company].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
      </footer>
    </article>
  );
}

function PoweredBy({ hide, muted }: { hide?: boolean; muted: string }) {
  if (hide) return null;
  return (
    <p className="text-center text-xs mt-10">
      <a
        href="https://testiflow.site"
        target="_blank"
        rel="noopener noreferrer"
        className="opacity-60 hover:opacity-100 transition-opacity"
        style={{ color: muted }}
      >
        Powered by TestiFlow
      </a>
    </p>
  );
}

export default function WallOfLove({
  testimonials,
  themePreset = 'saas',
  layout = 'grid',
  title = 'Wall of Love',
  subtitle = 'What our customers say',
  columns = 3,
  compact = false,
  customize: customizePartial,
}: WallOfLoveProps) {
  const customize = mergeCustomize({ ...customizePartial, themePreset, layout });
  const activeLayout = customize.layout;
  const theme = WIDGET_THEME_PRESETS[customize.themePreset] ?? WIDGET_THEME_PRESETS.saas;
  const wallShell = compact ? 'min-h-0 py-6 px-4' : 'min-h-screen py-12 px-4';
  const bg = theme.backgroundColor.startsWith('linear')
    ? { background: theme.backgroundColor }
    : { backgroundColor: theme.backgroundColor };

  if (testimonials.length === 0) {
    return (
      <div className="tf-wall-empty py-16 text-center" style={{ ...bg, color: theme.mutedColor }}>
        <p className="text-lg font-medium">No testimonials published yet.</p>
        <p className="text-sm mt-2">Check back soon!</p>
      </div>
    );
  }

  const header = !compact && (
    <header className="text-center mb-10 px-4">
      <h1
        className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
        style={{ color: theme.textColor, fontFamily: theme.fontFamily }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg" style={{ color: theme.mutedColor }}>
          {subtitle}
        </p>
      )}
    </header>
  );

  if (activeLayout === 'marquee') {
    const doubled = [...testimonials, ...testimonials];
    return (
      <div className={`tf-wall tf-wall-marquee ${compact ? 'min-h-0 py-6' : 'min-h-screen py-12'}`} style={{ ...bg, fontFamily: theme.fontFamily }}>
        {header}
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-marquee" style={{ width: 'max-content' }}>
            {doubled.map((t, i) => (
              <div key={`${t._id}-${i}`} className="w-[320px] shrink-0">
                <TestimonialCard t={t} theme={theme} customize={customize} />
              </div>
            ))}
          </div>
        </div>
        <PoweredBy hide={customize.hideBranding} muted={theme.mutedColor} />
      </div>
    );
  }

  if (activeLayout === 'carousel') {
    return (
      <div className={`tf-wall ${wallShell}`} style={{ ...bg, fontFamily: theme.fontFamily }}>
        {header}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div key={t._id} className="min-w-[300px] max-w-[340px] snap-center shrink-0">
              <TestimonialCard t={t} theme={theme} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeLayout === 'bento') {
    return (
      <div className={`tf-wall ${wallShell}`} style={{ ...bg, fontFamily: theme.fontFamily }}>
        {header}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto auto-rows-[minmax(140px,auto)]">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={t._id}
              t={t}
              theme={theme}
              customize={customize}
              className={i % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''}
            />
          ))}
        </div>
        {!compact && <PoweredBy hide={customize.hideBranding} muted={theme.mutedColor} />}
      </div>
    );
  }

  if (activeLayout === 'masonry') {
    return (
      <div className={`tf-wall ${wallShell}`} style={{ ...bg, fontFamily: theme.fontFamily }}>
        {header}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div key={t._id} className="break-inside-avoid mb-4">
              <TestimonialCard t={t} theme={theme} customize={customize} />
            </div>
          ))}
        </div>
        {!compact && <PoweredBy hide={customize.hideBranding} muted={theme.mutedColor} />}
      </div>
    );
  }

  if (activeLayout === 'floating') {
    return (
      <div className="tf-wall min-h-[60vh] py-12 px-4 relative overflow-hidden" style={{ ...bg, fontFamily: theme.fontFamily }}>
        {header}
        <div className="max-w-lg mx-auto space-y-4">
          {testimonials.slice(0, 5).map((t, i) => (
            <div
              key={t._id}
              className="tf-float-card"
              style={{
                transform: `translateX(${i % 2 === 0 ? 0 : 12}px) rotate(${i % 2 === 0 ? -1 : 1}deg)`,
                zIndex: 10 - i,
              }}
            >
              <TestimonialCard t={t} theme={theme} customize={customize} />
            </div>
          ))}
        </div>
        {!compact && <PoweredBy hide={customize.hideBranding} muted={theme.mutedColor} />}
      </div>
    );
  }

  if (activeLayout === 'columns') {
    const mid = Math.ceil(testimonials.length / 2);
    const cols = [testimonials.slice(0, mid), testimonials.slice(mid)];
    return (
      <div className={`tf-wall ${wallShell}`} style={{ ...bg, fontFamily: theme.fontFamily }}>
        {header}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto max-h-[80vh] overflow-hidden">
          {cols.map((col, ci) => (
            <div
              key={ci}
              className={`space-y-4 ${ci === 0 ? 'animate-columns-up' : 'animate-columns-down'}`}
            >
              {[...col, ...col].map((t, i) => (
                <TestimonialCard key={`${t._id}-${i}`} t={t} theme={theme} customize={customize} />
              ))}
            </div>
          ))}
        </div>
        {!compact && <PoweredBy hide={customize.hideBranding} muted={theme.mutedColor} />}
      </div>
    );
  }

  if (activeLayout === 'list') {
    return (
      <div className={`tf-wall ${wallShell} max-w-2xl mx-auto`} style={{ ...bg, fontFamily: theme.fontFamily }}>
        {header}
        <div className="space-y-4">
          {testimonials.map((t) => (
            <TestimonialCard key={t._id} t={t} theme={theme} customize={customize} />
          ))}
        </div>
      </div>
    );
  }

  const gridClass =
    columns <= 1
      ? 'grid-cols-1'
      : columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : columns >= 4
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`tf-wall ${wallShell}`} style={{ ...bg, fontFamily: theme.fontFamily }}>
      {header}
      <div className={`tf-wall-grid grid gap-4 max-w-6xl mx-auto ${gridClass}`}>
        {testimonials.map((t) => (
          <TestimonialCard key={t._id} t={t} theme={theme} customize={customize} />
        ))}
      </div>
      {!compact && <PoweredBy hide={customize.hideBranding} muted={theme.mutedColor} />}
    </div>
  );
}
