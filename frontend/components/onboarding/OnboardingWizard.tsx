'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, ArrowRight, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { getScriptEmbed } from '@/lib/embed/snippets';

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

export default function OnboardingWizard({ onSiteCreated, onDismiss }: OnboardingWizardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [siteId, setSiteId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const createSite = async () => {
    if (!name.trim()) {
      showToast('Enter a site name', 'error');
      return;
    }
    setCreating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create site');
      }
      const site = await res.json();
      setSiteId(site.siteId);
      onSiteCreated?.(site.siteId);
      setStep(2);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed to create site', 'error');
    } finally {
      setCreating(false);
    }
  };

  const embedCode = siteId ? getScriptEmbed({ baseUrl, siteId }) : '';

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    showToast('Copied! Paste before </body> on your site.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const finish = () => {
    markOnboardingComplete();
    if (siteId) router.push(`/sites/${siteId}`);
    onDismiss?.();
  };

  const steps = ['Name your site', 'Install embed', 'You\'re ready'];

  return (
    <Card className="mb-8 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Quick setup</h2>
        <span className="text-sm text-gray-500 ml-auto">
          Step {step} of 3 — {steps[step - 1]}
        </span>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-indigo-600' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 max-w-md">
          <p className="text-sm text-gray-600">
            Create a site to collect testimonials. You can add more sites later.
          </p>
          <Input
            label="Site name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My SaaS Product"
          />
          <Button onClick={createSite} isLoading={creating}>
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && siteId && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Paste this script on your website (before <code className="text-xs bg-gray-100 px-1 rounded">&lt;/body&gt;</code>).
          </p>
          <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">{embedCode}</pre>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={copyEmbed} variant="outline">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy script
            </Button>
            <Button onClick={() => setStep(3)}>
              I&apos;ve installed it
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 max-w-lg">
          <p className="text-sm text-gray-600">
            Share your collection link or open the dashboard to approve testimonials and publish your Wall of Love.
          </p>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li>Publish testimonials from the Testimonials tab</li>
            <li>Use Embed Studio for Wall of Love iframe code</li>
            <li>Share <code className="text-xs bg-gray-100 px-1 rounded">{baseUrl}/collect/{siteId}</code></li>
          </ul>
          <Button onClick={finish}>
            Open site dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </Card>
  );
}
