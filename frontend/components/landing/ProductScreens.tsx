'use client';

import Link from 'next/link';
import { BarChart3, Layout, Sparkles, Layers } from 'lucide-react';
import BrowserFrame from '@/components/ui/BrowserFrame';

interface ProductScreensProps {
  darkMode?: boolean;
}

const screens = [
  {
    icon: Layout,
    title: 'Embed Studio',
    desc: 'Copy wall, collect, and display snippets with iframe auto-resize.',
    gradient: 'from-indigo-500 to-violet-600',
    mock: (
      <div className="p-4 space-y-3 bg-slate-50 min-h-[200px]">
        <div className="flex gap-2">
          {['Collect', 'Wall', 'Display'].map((t, i) => (
            <span
              key={t}
              className={`px-3 py-1 rounded-md text-xs font-medium ${i === 1 ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-600'}`}
            >
              {t}
            </span>
          ))}
        </div>
        <pre className="text-[10px] bg-gray-900 text-green-400 p-3 rounded-lg overflow-hidden">
          {`<iframe src="testiflow.site/embed/w/..." />`}
        </pre>
      </div>
    ),
  },
  {
    icon: Sparkles,
    title: 'Widget customizer',
    desc: 'Themes, layouts, spacing, shadows — live preview before publish.',
    gradient: 'from-violet-500 to-fuchsia-600',
    mock: (
      <div className="p-4 grid grid-cols-2 gap-2 min-h-[200px] bg-slate-50">
        {['saas', 'dark', 'glass', 'ocean'].map((t) => (
          <div key={t} className="rounded-lg border bg-white p-2 text-center text-xs capitalize">
            {t}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    desc: 'Wall views, widget impressions, funnel from click to submission.',
    gradient: 'from-cyan-500 to-blue-600',
    mock: (
      <div className="p-4 min-h-[200px] bg-slate-50">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { l: 'Wall views', v: '2.4k' },
            { l: 'Impressions', v: '8.1k' },
            { l: 'Submissions', v: '142' },
          ].map((s) => (
            <div key={s.l} className="bg-white rounded-lg p-2 border text-center">
              <div className="text-lg font-bold text-indigo-600">{s.v}</div>
              <div className="text-[10px] text-gray-500">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="h-16 flex items-end gap-1">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 bg-indigo-500/80 rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Layers,
    title: 'AI enrichment',
    desc: 'Headlines, tags, and sentiment on every testimonial automatically.',
    gradient: 'from-amber-500 to-orange-600',
    mock: (
      <div className="p-4 space-y-2 min-h-[200px] bg-slate-50">
        <div className="bg-white border rounded-lg p-3 text-xs">
          <span className="text-[10px] font-semibold text-violet-600 uppercase">AI headline</span>
          <p className="mt-1 text-gray-700">&ldquo;Doubled our signup conversion&rdquo;</p>
          <div className="flex gap-1 mt-2">
            {['conversion', 'saas', 'verified'].map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full text-[10px]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export default function ProductScreens({ darkMode = false }: ProductScreensProps) {
  return (
    <section className={`py-20 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-indigo-600 mb-2">PRODUCT TOUR</p>
          <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Built for marketers and developers
          </h2>
          <p className={`max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Screenshots from the real dashboard — embed, customize, analyze, and enrich in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {screens.map((s) => {
            const Icon = s.icon;
            return (
              <BrowserFrame key={s.title} title={s.title} dark={darkMode}>
                <div className={`p-4 border-b ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-100 bg-white'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${s.gradient} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{s.title}</h3>
                      <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{s.desc}</p>
                    </div>
                  </div>
                </div>
                {s.mock}
              </BrowserFrame>
            );
          })}
        </div>

        <p className={`text-center mt-10 text-sm ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
          <Link href="/docs" className="text-indigo-600 hover:underline font-medium">
            Read the docs
          </Link>{' '}
          ·{' '}
          <Link href="/integration-guide" className="text-indigo-600 hover:underline font-medium">
            Integration guide
          </Link>
        </p>
      </div>
    </section>
  );
}
