'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';
import WallOfLove from '@/components/wall/WallOfLove';
import { DEMO_TESTIMONIALS } from '@/lib/demo/mockData';
import { WIDGET_THEME_LIST, type WidgetThemePreset } from '@/lib/widgetThemes';
import type { WidgetCustomizeConfig } from '@/lib/widget/customizer';

const LAYOUTS: WidgetCustomizeConfig['layout'][] = [
  'grid', 'carousel', 'marquee', 'list', 'bento', 'masonry', 'floating', 'columns',
];

export default function DocsPlaygroundPage() {
  const [theme, setTheme] = useState<WidgetThemePreset>('saas');
  const [layout, setLayout] = useState<WidgetCustomizeConfig['layout']>('grid');
  const [animation, setAnimation] = useState<WidgetCustomizeConfig['animationStyle']>('spring');
  const [copied, setCopied] = useState(false);

  const snippet = `<div
  data-testiflow-wall="YOUR_SITE_ID"
  data-theme="${theme}"
  data-layout="${layout}"
></div>
<script src="https://testiflow.site/embed.js" async></script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gridColumns = layout === 'grid' ? 2 : 3;

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-zinc-200 bg-white px-6 sm:px-10 py-6">
        <p className="text-sm font-medium text-indigo-600 mb-1">Documentation</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Interactive playground</h1>
        <p className="text-zinc-600 mt-2 max-w-2xl">
          Tune theme, layout, and animation. The preview updates instantly — copy the embed snippet when ready.
        </p>
      </header>

      <div className="flex-1 flex flex-col xl:flex-row min-h-0">
        <aside className="xl:w-80 shrink-0 border-b xl:border-b-0 xl:border-r border-zinc-200 bg-white p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="text-sm font-semibold text-zinc-900 block mb-3">Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {WIDGET_THEME_LIST.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    theme === t.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {t.id}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-900 block mb-2">Layout</label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value as WidgetCustomizeConfig['layout'])}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {LAYOUTS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-900 block mb-2">Animation</label>
            <select
              value={animation}
              onChange={(e) => setAnimation(e.target.value as WidgetCustomizeConfig['animationStyle'])}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="none">None</option>
              <option value="subtle">Subtle</option>
              <option value="spring">Spring</option>
              <option value="glow">Glow</option>
            </select>
          </div>

          <div className="rounded-xl bg-zinc-900 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-zinc-400">Embed snippet</p>
              <button
                type="button"
                onClick={copySnippet}
                className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="text-xs text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {snippet}
            </pre>
          </div>

          <Link
            href="/examples"
            className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 py-2"
          >
            Browse full examples →
          </Link>
        </aside>

        <section className="flex-1 min-w-0 bg-zinc-100 p-4 sm:p-6 overflow-auto">
          <div className="playground-preview rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-sm min-h-[560px]">
            <WallOfLove
              key={`${theme}-${layout}-${animation}`}
              testimonials={DEMO_TESTIMONIALS}
              themePreset={theme}
              layout={layout}
              title="Playground preview"
              subtitle="Changes apply instantly"
              columns={gridColumns}
              compact
              customize={{
                animationStyle: animation,
                hideBranding: true,
                spacing: 20,
                borderRadius: 14,
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
