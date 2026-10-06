import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AuthCtaLink } from '@/components/auth/AuthCtaLink';

export const metadata: Metadata = {
  title: 'TestiFlow vs Testimonial.to',
  description:
    'Testimonial.to if you need video at scale. TestiFlow if you need a Wall of Love on a Framer, Webflow, or Next.js site this week.',
  alternates: { canonical: '/compare/testimonial-to' },
};

const rows: { feature: string; testiflow: string; competitor: string }[] = [
  { feature: 'Starting paid price', testiflow: '$5/month', competitor: '$25/month Starter' },
  { feature: 'Free start', testiflow: '30-day trial, no card', competitor: 'Free plan: 10 text, 2 video' },
  { feature: 'Unlimited video', testiflow: 'Included on paid plans', competitor: '$50/month per Space (Ultimate)' },
  { feature: 'Wall of Love embed', testiflow: 'Yes', competitor: 'Yes' },
  { feature: 'Review imports', testiflow: 'No', competitor: 'Yes, including X, LinkedIn, G2' },
  { feature: 'Case studies and NPS', testiflow: 'No', competitor: 'On higher plans' },
  { feature: 'Remove platform link', testiflow: 'On any paid plan', competitor: 'Depends on plan' },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900 dark:text-white">
            TestiFlow
          </Link>
          <AuthCtaLink className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Build my wall
          </AuthCtaLink>
        </div>
      </nav>

      <header className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Testimonial.to if you need video at scale. TestiFlow if you need a wall this week.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
          Testimonial.to is the larger product: collection, a Wall of Love, imports, and higher plans for unlimited
          video, case studies, and NPS. TestiFlow publishes quotes you already have and embeds them on Framer, Webflow,
          or Next.js. Prices below are from Testimonial.to’s public pricing article and from TestiFlow’s pricing page.
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-4 pb-12 overflow-x-auto">
        <table className="w-full border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden text-sm">
          <thead className="bg-gray-50 dark:bg-slate-900">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Feature</th>
              <th className="p-4 font-semibold text-indigo-600 dark:text-indigo-400">TestiFlow</th>
              <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Testimonial.to</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-t border-gray-100 dark:border-slate-800">
                <td className="p-4 text-gray-900 dark:text-white font-medium">{row.feature}</td>
                <td className="p-4 text-center text-sm text-gray-700 dark:text-gray-300">{row.testiflow}</td>
                <td className="p-4 text-center text-sm text-gray-700 dark:text-gray-300">{row.competitor}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-3">
          Competitor prices: testimonial.to/guide/articles/pricing. TestiFlow prices: this site’s pricing page.
        </p>
      </div>

      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Testimonial.to when video is the product</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-3">
          Choose TestiFlow when you have a handful of written quotes and a marketing site. The trial is 30 days. The
          TestiFlow link stays on the wall until you pay.
        </p>
        <AuthCtaLink className="inline-flex items-center mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
          Build my wall
          <ArrowRight className="h-4 w-4 ml-2" />
        </AuthCtaLink>
        <p className="mt-6 text-sm">
          <Link href="/vs/senja" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Compare with Senja
          </Link>
          {' · '}
          <Link href="/vs/famewall" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Compare with Famewall
          </Link>
        </p>
      </section>
    </div>
  );
}
