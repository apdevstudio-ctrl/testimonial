'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, ArrowRight, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { getWallIframeEmbed, getPublicWallUrl, getCollectUrl } from '@/lib/embed/snippets';
import { advanceFunnel, trackClarity } from '@/lib/analytics/clarity';

const STORAGE_KEY = 'testiflow_onboarding_done';

export function isOnboardingComplete(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEY) === '1';
}

export function markOnboardingComplete() {
  localStorage.setItem(STORAGE_KEY, '1');
}

interface OnboardingWizardProps {
  onSiteCreated?: (siteId: string) => void;
  onDismiss?: () => void;
}

const ASK_EMAIL = `Could you reply with two sentences on what changed after you used the product? I'll paste it on the site only after you approve the wording.`;

export default function OnboardingWizard({ onSiteCreated, onDismiss }: OnboardingWizardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [siteId, setSiteId] = useState<string | null>(null);
  const [publicSlug, setPublicSlug] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<'wall' | 'embed' | 'ask' | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const createSiteAndQuote = async () => {
    if (!name.trim()) {
      showToast('Enter a product name', 'error');
      return;
    }
    if (!quote.trim() || !authorName.trim()) {
      showToast('Add a quote and the customer’s name', 'error');
      return;
    }
    setCreating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const siteRes = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!siteRes.ok) {
        const err = await siteRes.json();
        throw new Error(err.message || 'Failed to create site');
      }
      const site = await siteRes.json();
      const quoteRes = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId: site.siteId,
          text: quote.trim(),
          authorName: authorName.trim(),
          authorPosition: authorRole.trim(),
        }),
      });
      if (!quoteRes.ok) {
        const err = await quoteRes.json();
        throw new Error(err.message || 'Failed to save the quote');
      }
      setSiteId(site.siteId);
      setPublicSlug(site.publicSlug || null);
      onSiteCreated?.(site.siteId);
      trackClarity('site_created', { source: 'onboarding' });
      advanceFunnel('site_created');
      trackClarity('quote_added', { source: 'onboarding' });
      advanceFunnel('quote_added');
      setStep(2);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed to create your wall', 'error');
    } finally {
      setCreating(false);
    }
  };

  const wallUrl = siteId ? getPublicWallUrl(baseUrl, publicSlug || siteId) : '';
  const embedCode = siteId ? getWallIframeEmbed({ baseUrl, siteId }) : '';
  const collectUrl = siteId ? getCollectUrl(baseUrl, siteId) : '';

  const copyText = async (kind: 'wall' | 'embed' | 'ask', value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    if (kind === 'embed') {
      trackClarity('embed_copied', { source: 'onboarding' });
      advanceFunnel('embed_copied');
    } else if (kind === 'wall') {
      trackClarity('wall_link_copied', { source: 'onboarding' });
    } else {
      trackClarity('ask_email_copied', { source: 'onboarding' });
    }
    showToast('Copied', 'success');
    setTimeout(() => setCopied(null), 2000);
  };

  const finish = () => {
    trackClarity('onboarding_finished');
    markOnboardingComplete();
    if (siteId) router.push(`/sites/${siteId}`);
    onDismiss?.();
  };

  return (
    <Card className="mb-8 border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-slate-900">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your first wall</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
          Step {step} of 2
        </span>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              s <= step ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 max-w-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Paste one real quote. You will see it on a wall before any embed code.
          </p>
          <Input
            label="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My SaaS"
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quote
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="What a customer actually said"
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </label>
          <Input
            label="Customer name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Jordan Lee"
          />
          <Input
            label="Role and company"
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
            placeholder="Founder, Northwind"
          />
          <Button onClick={createSiteAndQuote} isLoading={creating}>
            Show my wall
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && siteId && (
        <div className="space-y-4 max-w-2xl">
          <p className="text-sm text-gray-900 dark:text-white font-medium">This is your wall.</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add two more quotes from the dashboard before you treat it as finished. The embed can go on your site whenever you want.
          </p>
          <iframe
            title="Your wall"
            src={`${baseUrl}/embed/w/${siteId}`}
            className="w-full min-h-[320px] rounded-xl border border-gray-200 dark:border-slate-700 bg-white"
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => copyText('wall', wallUrl)}>
              {copied === 'wall' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy wall link
            </Button>
            <Button variant="outline" onClick={() => copyText('embed', embedCode)}>
              {copied === 'embed' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy embed
            </Button>
            <Button variant="outline" onClick={() => copyText('ask', ASK_EMAIL)}>
              {copied === 'ask' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy ask email
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
            Collect link: {collectUrl}
          </p>
          <Button onClick={finish}>
            Open site dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </Card>
  );
}
