'use client';

import Link from 'next/link';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { AuthCtaLink } from '@/components/auth/AuthCtaLink';
import type { IntegrationPlatform } from '@/lib/integrations/platforms';
import { getWallIframeEmbed } from '@/lib/embed/snippets';

interface Props {
  platform: IntegrationPlatform;
}

export default function IntegrationPageContent({ platform }: Props) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://testiflow.site';
  const sampleCode = getWallIframeEmbed({
    baseUrl,
    siteId: 'your-site-id',
    theme: 'saas',
    layout: 'grid',
  });

  const copy = () => {
    navigator.clipboard.writeText(sampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="min-h-screen bg-white">
      <header className="border-b border-gray-100 dark:border-slate-800 bg-gradient-to-b from-indigo-50/80 to-white dark:to-slate-950">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
          <Link href="/integrations" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
            ← All integrations
          </Link>
          <span className="text-4xl mt-4 block">{platform.icon}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-4 tracking-tight">
            {platform.headline}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">{platform.description}</p>
          <AuthCtaLink className="inline-block mt-8">
            <Button size="lg">
              Start free trial
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </AuthCtaLink>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">How to integrate</h2>
        <ol className="space-y-8">
          {platform.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-bold">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {platform.tips && platform.tips.length > 0 && (
          <div className="mt-10 rounded-xl bg-amber-50 border border-amber-100 p-4">
            <p className="text-sm font-medium text-amber-900 mb-2">Tips</p>
            <ul className="text-sm text-amber-800 list-disc list-inside space-y-1">
              {platform.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sample embed code</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Replace <code className="bg-gray-100 px-1 rounded">your-site-id</code> with your site ID from the
          dashboard.
        </p>
        <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto mb-4">{sampleCode}</pre>
        <Button variant="outline" onClick={copy}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          Copy sample code
        </Button>
      </section>
    </article>
  );
}
