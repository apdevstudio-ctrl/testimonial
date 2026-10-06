import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AuthCtaLink } from '@/components/auth/AuthCtaLink';

export const metadata: Metadata = {
  title: 'Senja alternative for a simple Wall of Love',
  description:
    'Senja is the social-proof suite. TestiFlow is a Wall of Love and an embed for founders who already have a handful of quotes.',
  alternates: { canonical: '/vs/senja' },
};

const rows = [
  ['Job', 'Publish quotes you already have', 'Collect, import, design, and reuse proof everywhere'],
  ['Free', '30-day trial. Link stays on the wall.', '15 testimonials, widgets, walls, Senja branding'],
  ['First paid plan', '$5/month. Branding comes off.', '$29/month Starter'],
  ['Imports from G2, X, and others', 'No', 'Yes, 30+ sources'],
  ['Case studies, images, Chrome extension', 'No', 'Yes'],
  ['Embed', 'One snippet for Framer, Webflow, Next.js', 'Many widget templates'],
];

export default function SenjaComparePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900 dark:text-white">TestiFlow</Link>
          <AuthCtaLink className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Build my wall</AuthCtaLink>
        </div>
      </nav>
      <header className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Senja is the suite. TestiFlow is the wall.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
          Use Senja if you import reviews from other sites, run a team, or turn testimonials into case studies and
          images. Use TestiFlow if you already have a few customer quotes and need them on a Framer, Webflow, or
          Next.js page. Senja’s free plan and $29 Starter price are from Senja’s public plan table. TestiFlow’s $5
          price is from this site.
        </p>
      </header>
      <div className="max-w-4xl mx-auto px-4 pb-12 overflow-x-auto">
        <table className="w-full border border-gray-200 dark:border-slate-700 text-sm">
          <thead className="bg-gray-50 dark:bg-slate-900">
            <tr>
              <th className="text-left p-4"> </th>
              <th className="p-4 text-indigo-600">TestiFlow</th>
              <th className="p-4 text-gray-600 dark:text-gray-300">Senja</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-gray-100 dark:border-slate-800">
                <td className="p-4 font-medium text-gray-900 dark:text-white">{row[0]}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{row[1]}</td>
                <td className="p-4 text-gray-700 dark:text-gray-300">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Senja wins if you need imports</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-3">
          TestiFlow wins if the job is “put these quotes on the site today.” The trial is 30 days and the link stays
          on until you pay.
        </p>
        <AuthCtaLink className="inline-flex items-center mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg">
          Build my wall
          <ArrowRight className="h-4 w-4 ml-2" />
        </AuthCtaLink>
      </section>
    </div>
  );
}
