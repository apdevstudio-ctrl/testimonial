'use client';

import Link from 'next/link';
import { DOC_SECTIONS } from '@/lib/docs/sections';
import { useI18n } from '@/contexts/I18nProvider';

export default function DocsChrome({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      <aside className="lg:w-64 lg:min-h-screen border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="p-5 lg:p-6 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
          <Link href="/" className="font-bold text-zinc-900 dark:text-white block mb-1">
            TestiFlow
          </Link>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">{t('docs.subtitle')}</p>
          <nav className="space-y-0.5">
            {DOC_SECTIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/docs/${s.slug}`}
                className="block text-sm text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg px-3 py-2 transition-colors"
              >
                {s.title}
              </Link>
            ))}
            <Link
              href="/docs/playground"
              className="block text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/15 rounded-lg px-3 py-2 mt-2"
            >
              {t('docs.playground')}
            </Link>
          </nav>
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-slate-800 space-y-2">
            <Link
              href="/integration-guide"
              className="block text-xs text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {t('nav.integrationGuide')} →
            </Link>
            <Link
              href="/examples"
              className="block text-xs text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {t('nav.liveExamples')} →
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0 text-zinc-900 dark:text-zinc-100">{children}</main>
    </div>
  );
}
