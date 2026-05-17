'use client';

import { DEMO_TESTIMONIALS } from '@/lib/demo/mockData';

const PREVIEW_ITEMS = DEMO_TESTIMONIALS.slice(0, 2);

export default function HeroWallPreview() {
  return (
    <div
      className="hero-wall-preview relative overflow-hidden rounded-b-xl"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div className="px-5 pt-5 pb-4 text-center">
        <h3 className="text-white font-semibold text-base tracking-tight">Wall of Love</h3>
        <p className="text-white/75 text-xs mt-0.5">Live on your site</p>
      </div>

      <div className="px-4 pb-5 grid grid-cols-2 gap-3">
        {PREVIEW_ITEMS.map((t) => {
          const initials = (t.author?.name || 'A')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          return (
            <article
              key={t._id}
              className="rounded-2xl p-3.5 flex flex-col min-h-[200px]"
              style={{
                background: 'rgba(255,255,255,0.14)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)',
              }}
            >
              {t.verified && (
                <span className="self-start text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-100 mb-2">
                  Verified
                </span>
              )}
              <div className="flex gap-0.5 mb-2 text-amber-300 text-xs" aria-hidden>
                {'★★★★★'}
              </div>
              <p className="text-white text-[13px] leading-snug flex-1 line-clamp-5">
                &ldquo;{t.text}&rdquo;
              </p>
              <footer className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                  style={{ background: 'rgba(99, 102, 241, 0.9)' }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="text-white text-xs font-semibold truncate">{t.author?.name}</div>
                  <div className="text-white/65 text-[10px] truncate">
                    {[t.author?.position, t.author?.company].filter(Boolean).join(' · ')}
                  </div>
                </div>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
