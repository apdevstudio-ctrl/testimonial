import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AuthCtaLink } from '@/components/auth/AuthCtaLink';

export const metadata: Metadata = {
  title: 'Famewall vs TestiFlow',
  description:
    'Famewall and TestiFlow are both inexpensive testimonial tools. Here is the actual difference in price and job.',
  alternates: { canonical: '/vs/famewall' },
};

const rows = [
  ['Free', '30-day trial, then the dashboard locks. Published walls stay up.', '10 testimonials, 1 wall, 1 video'],
  ['First paid plan', '$5/month', '$12/month Standard'],
  ['Cheapest way to pay', 'Yearly at $55, about $4.58/month. Six months is $28, about $4.67/month.', 'Annual billing on Famewall’s plans'],
  ['Video', 'On paid plans', 'Capped on lower plans, unlimited higher up'],
  ['Multiple walls', 'One site at a time in the first-run flow. More sites can be created in the dashboard.', 'Plan limits: 1, 4, 15, or unlimited'],
  ['Agency workspaces', 'No', 'Business and Agency plans'],
];

export default function FamewallComparePage() {
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
          Both are inexpensive. Here is the actual difference.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
          Famewall is the budget wall tool with a forever-free tier and an agency plan. TestiFlow is a 30-day trial
          and a $5 monthly plan for founders who want one wall on a marketing site. Famewall prices are from
          famewall.io/pricing. TestiFlow prices are from this site. Check both before you buy. Vendors change plans.
        </p>
      </header>
      <div className="max-w-4xl mx-auto px-4 pb-12 overflow-x-auto">
        <table className="w-full border border-gray-200 dark:border-slate-700 text-sm">
          <thead className="bg-gray-50 dark:bg-slate-900">
            <tr>
              <th className="text-left p-4"> </th>
              <th className="p-4 text-indigo-600">TestiFlow</th>
              <th className="p-4">Famewall</th>
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
        <p className="text-gray-600 dark:text-gray-400">
          Pick Famewall if you want a free wall that stays free, or if you manage client walls. Pick TestiFlow if you
          want to paste quotes and embed them this afternoon.
        </p>
        <AuthCtaLink className="inline-flex items-center mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg">
          Build my wall
          <ArrowRight className="h-4 w-4 ml-2" />
        </AuthCtaLink>
      </section>
    </div>
  );
}
