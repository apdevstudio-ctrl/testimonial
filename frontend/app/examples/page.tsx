import Link from 'next/link';
import { DEMO_PRESETS } from '@/lib/demo/mockData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Widget examples — TestiFlow',
  description: 'Explore live Wall of Love presets: themes, layouts, and embed snippets.',
};

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/landing" className="font-bold text-indigo-600">
            TestiFlow
          </Link>
          <Link href="/signup" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Start free →
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Public demo walls</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl">
          Every preset is a real embed configuration. Open a demo, copy the snippet, or use it on your site.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_PRESETS.map((preset) => (
            <Link
              key={preset.id}
              href={`/examples/${preset.id}`}
              className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-indigo-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">{preset.name}</h2>
                <span className="text-xs font-mono px-2 py-1 rounded bg-indigo-50 text-indigo-700">{preset.theme}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{preset.description}</p>
              <div className="flex gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 rounded bg-gray-100">{preset.layout}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
