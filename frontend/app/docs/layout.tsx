import Link from 'next/link';
import { DOC_SECTIONS } from '@/lib/docs/sections';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row">
      <aside className="lg:w-64 lg:min-h-screen border-b lg:border-b-0 lg:border-r border-zinc-200 bg-white shrink-0">
        <div className="p-5 lg:p-6 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
          <Link href="/" className="font-bold text-zinc-900 block mb-1">
            TestiFlow
          </Link>
          <p className="text-xs text-zinc-500 mb-6">Documentation</p>
          <nav className="space-y-0.5">
            {DOC_SECTIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/docs/${s.slug}`}
                className="block text-sm text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg px-3 py-2 transition-colors"
              >
                {s.title}
              </Link>
            ))}
            <Link
              href="/docs/playground"
              className="block text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg px-3 py-2 mt-2"
            >
              Interactive playground
            </Link>
          </nav>
          <div className="mt-8 pt-6 border-t border-zinc-100 space-y-2">
            <Link href="/integration-guide" className="block text-xs text-zinc-500 hover:text-indigo-600">
              Integration guide →
            </Link>
            <Link href="/examples" className="block text-xs text-zinc-500 hover:text-indigo-600">
              Live examples →
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
