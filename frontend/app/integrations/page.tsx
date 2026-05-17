import type { Metadata } from 'next';
import Link from 'next/link';
import { INTEGRATION_PLATFORMS } from '@/lib/integrations/platforms';
import { getSiteUrl } from '@/lib/seo/siteUrl';

export const metadata: Metadata = {
  title: 'Integrations — Embed testimonials on any platform',
  description:
    'Add TestiFlow testimonials to WordPress, Webflow, Framer, React, Next.js, Shopify, and more. Copy-paste embed in minutes.',
  alternates: { canonical: '/integrations' },
};

export default function IntegrationsHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-gradient-to-b from-indigo-50/80 to-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Integrate with any platform
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Embed your Wall of Love or collection widget on the tools you already use. No complex setup.
          </p>
          <Link
            href="/signup"
            className="inline-flex mt-8 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
          >
            Get started free
          </Link>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTEGRATION_PLATFORMS.map((p) => (
          <Link
            key={p.slug}
            href={`/integrations/${p.slug}`}
            className="block p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <span className="text-3xl">{p.icon}</span>
            <h2 className="font-semibold text-gray-900 mt-3">{p.name}</h2>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.description}</p>
          </Link>
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 pb-12">
        <Link href="/integration-guide" className="text-indigo-600 hover:underline">
          Full integration guide →
        </Link>
      </p>
    </div>
  );
}
