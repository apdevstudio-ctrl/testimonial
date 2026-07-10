import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Layout, Sparkles } from 'lucide-react';
import { AuthCtaLink } from '@/components/auth/AuthCtaLink';

export const metadata: Metadata = {
  title: 'Wall of Love — Showcase customer testimonials',
  description:
    'Create a beautiful, embeddable Wall of Love with video and text testimonials. Auto-resizing iframe, premium themes, SEO-friendly public pages.',
  alternates: { canonical: '/wall-of-love' },
};

export default function WallOfLoveProductPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <nav className="border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900 dark:text-white">
            TestiFlow
          </Link>
          <AuthCtaLink className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
            Start free trial
          </AuthCtaLink>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
          <Layout className="h-4 w-4" />
          Wall of Love
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight max-w-3xl mx-auto">
          Your best testimonials, in one beautiful wall
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mt-6 max-w-2xl mx-auto">
          Publish approved reviews to a public page and embed it anywhere with auto-resizing iframe code.
        </p>
        <AuthCtaLink className="inline-flex items-center mt-10 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">
          Create your wall
          <ArrowRight className="h-5 w-5 ml-2" />
        </AuthCtaLink>
      </header>

      <section className="max-w-5xl mx-auto px-4 pb-20 grid md:grid-cols-3 gap-8">
        {[
          {
            title: 'Public SEO page',
            body: 'Every site gets a shareable URL at testiflow.site/w/your-slug that Google can index.',
          },
          {
            title: '8 premium themes',
            body: 'Minimal, glass, dark, SaaS, and more—match your brand without custom CSS.',
          },
          {
            title: 'Grid, carousel, marquee',
            body: 'Choose layouts that fit landing pages, footers, or full-width social proof sections.',
          },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
            <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-3" />
            <h2 className="font-semibold text-gray-900 dark:text-white">{item.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-gray-50 dark:bg-slate-950 border-y border-gray-100 dark:border-slate-800 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Embed in under a minute</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3">
            Copy iframe + iframe-resizer snippet from Embed Studio—same pattern used by leading testimonial
            platforms.
          </p>
          <Link href="/integrations" className="inline-block mt-6 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            See platform guides →
          </Link>
        </div>
      </section>
    </div>
  );
}
