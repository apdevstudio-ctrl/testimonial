'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Copy, Check } from 'lucide-react';
import WallOfLove from '@/components/wall/WallOfLove';
import { DEMO_PRESETS, DEMO_TESTIMONIALS } from '@/lib/demo/mockData';
import { WIDGET_THEME_LIST } from '@/lib/widgetThemes';
import type { WidgetThemePreset } from '@/lib/widgetThemes';
import type { WidgetCustomizeConfig } from '@/lib/widget/customizer';
import Button from '@/components/ui/Button';
import { useI18n } from '@/contexts/I18nProvider';

interface LiveDemoGalleryProps {
  darkMode?: boolean;
  id?: string;
}

export default function LiveDemoGallery({ darkMode = false, id = 'demo' }: LiveDemoGalleryProps) {
  const { t } = useI18n();
  const [presetId, setPresetId] = useState(DEMO_PRESETS[0].id);
  const [copied, setCopied] = useState(false);

  const preset = DEMO_PRESETS.find((p) => p.id === presetId) ?? DEMO_PRESETS[0];

  const embedSnippet = `<div data-testiflow-wall="YOUR_SITE_ID" data-layout="${preset.layout}" data-theme="${preset.theme}"></div>
<script src="https://testiflow.site/embed.js" async></script>`;

  const copy = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id={id}
      className={`py-20 scroll-mt-24 ${darkMode ? 'bg-slate-900/50' : 'bg-gray-50'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-indigo-600 mb-2">{t('demo.eyebrow')}</p>
          <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('demo.title')}
          </h2>
          <p className={`max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            {t('demo.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {DEMO_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPresetId(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                presetId === p.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : darkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className={`rounded-xl p-5 border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{preset.name}</h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{preset.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                  <span className="text-gray-500">Theme</span>
                  <p className={`font-mono font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{preset.theme}</p>
                </div>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
                  <span className="text-gray-500">Layout</span>
                  <p className={`font-mono font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{preset.layout}</p>
                </div>
              </div>
              <div className={`rounded-lg p-3 font-mono text-xs mb-3 overflow-x-auto ${darkMode ? 'bg-slate-950 text-slate-300' : 'bg-gray-900 text-gray-100'}`}>
                {embedSnippet}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copy}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border ${
                    darkMode ? 'border-slate-600 text-slate-300' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? t('hero.copied') : t('demo.copyEmbed')}
                </button>
                <Link href="/examples" className="flex-1">
                  <Button variant="primary" className="w-full text-sm">
                    {t('demo.allExamples')}
                  </Button>
                </Link>
              </div>
            </div>
            <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
              {t('demo.themesLabel')}: {WIDGET_THEME_LIST.map((theme) => theme.id).join(', ')}
            </p>
          </div>

          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-gray-200/80 shadow-2xl shadow-indigo-500/10 min-h-[420px]">
            <WallOfLove
              key={presetId}
              testimonials={DEMO_TESTIMONIALS}
              themePreset={preset.theme as WidgetThemePreset}
              layout={preset.layout as WidgetCustomizeConfig['layout']}
              title={preset.title}
              subtitle={preset.subtitle}
              compact
              customize={{ animationStyle: 'spring', hideBranding: true }}
            />
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/signup" className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700">
            Start building your wall <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
