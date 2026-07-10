'use client';

import { ArrowRight, Play, Code2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import BrowserFrame from '@/components/ui/BrowserFrame';
import HeroWallPreview from '@/components/landing/HeroWallPreview';
import { AuthCtaLink } from '@/components/auth/AuthCtaLink';
import { useI18n } from '@/contexts/I18nProvider';

interface LandingHeroProps {
  darkMode: boolean;
  onCopyScript: () => void;
  copied: boolean;
}

export default function LandingHero({ darkMode, onCopyScript, copied }: LandingHeroProps) {
  const { t } = useI18n();

  return (
    <section
      className={`relative overflow-hidden py-16 sm:py-20 lg:py-24 ${
        darkMode
          ? 'bg-gradient-to-br from-slate-950 via-indigo-950/40 to-violet-950/30'
          : 'bg-gradient-to-br from-indigo-50 via-white to-violet-50'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-violet-500/15 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="max-w-xl">
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${
                darkMode
                  ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t('hero.badge')}
            </span>
            <h1
              className={`text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight mb-5 leading-[1.08] ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            <p className={`text-lg mb-8 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <AuthCtaLink>
                <Button variant="primary" size="lg" className="group">
                  {t('hero.startTrial')}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </AuthCtaLink>
              <a href="#demo">
                <Button variant="outline" size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  {t('hero.liveDemo')}
                </Button>
              </a>
            </div>
            <button
              type="button"
              onClick={onCopyScript}
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono px-4 py-2.5 rounded-lg border transition-colors max-w-full ${
                darkMode
                  ? 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-indigo-500'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 shadow-sm'
              }`}
            >
              <Code2 className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {copied ? t('hero.copied') : '<script src="https://testiflow.site/embed.js" async></script>'}
              </span>
            </button>
          </div>

          <div className="w-full min-w-0 lg:max-w-none">
            <BrowserFrame
              url="yoursite.com"
              title={t('hero.previewTitle')}
              dark={darkMode}
              className="w-full shadow-xl shadow-indigo-500/10 ring-1 ring-black/5"
            >
              <HeroWallPreview />
            </BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
