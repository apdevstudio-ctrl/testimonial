import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'TestiFlow vs Testimonial.to — Alternative comparison',
  description:
    'Compare TestiFlow and Testimonial.to. Affordable pricing, developer-friendly embeds, Wall of Love, and modern widget themes.',
  alternates: { canonical: '/compare/testimonial-to' },
};

const rows = [
  { feature: 'Starting price', testiflow: 'From $5/mo', competitor: 'Higher tiered pricing' },
  { feature: 'Video + text collection', testiflow: true, competitor: true },
  { feature: 'Wall of Love embed', testiflow: true, competitor: true },
  { feature: 'Iframe auto-resize', testiflow: true, competitor: true },
  { feature: 'Public SEO wall URL', testiflow: true, competitor: true },
  { feature: '8+ widget themes', testiflow: true, competitor: 'Multiple' },
  { feature: 'Review imports (G2, Twitter)', testiflow: 'Coming soon', competitor: true },
  { feature: 'Brand monitor / AI', testiflow: 'Roadmap', competitor: 'Ultimate plan' },
  { feature: 'Developer docs & API', testiflow: 'Growing', competitor: true },
  { feature: '30-day free trial', testiflow: true, competitor: 'Credits' },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="h-5 w-5 text-green-600 mx-auto" />;
  if (value === false) return <X className="h-5 w-5 text-gray-300 mx-auto" />;
  return <span className="text-sm text-gray-700">{value}</span>;
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900">
            TestiFlow
          </Link>
          <Link href="/signup" className="text-sm font-medium text-indigo-600">
            Try TestiFlow free
          </Link>
        </div>
      </nav>

      <header className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">TestiFlow vs Testimonial.to</h1>
        <p className="text-lg text-gray-600 mt-4">
          A modern, affordable alternative for collecting and embedding customer testimonials.
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-4 pb-20 overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
              <th className="p-4 font-semibold text-indigo-600">TestiFlow</th>
              <th className="p-4 font-semibold text-gray-600">Testimonial.to</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-t border-gray-100">
                <td className="p-4 text-gray-900 font-medium">{row.feature}</td>
                <td className="p-4 text-center">
                  <Cell value={row.testiflow as boolean | string} />
                </td>
                <td className="p-4 text-center">
                  <Cell value={row.competitor as boolean | string} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Ready to switch?</h2>
        <p className="text-gray-600 mt-3">Start with a 30-day trial. Embed your first wall in minutes.</p>
        <Link
          href="/signup"
          className="inline-flex items-center mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
        >
          Start free trial
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </section>
    </div>
  );
}
