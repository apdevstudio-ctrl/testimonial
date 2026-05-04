'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { SIX_MONTH_DISPLAY_USD, YEARLY_DISPLAY_USD } from '@/lib/subscription/constants';

const plans = [
  { id: 'monthly' as const, title: 'One month', price: '$5', period: 'per month', blurb: 'Billed every month' },
  {
    id: 'six_month' as const,
    title: '6 months',
    price: `$${SIX_MONTH_DISPLAY_USD}`,
    period: 'per 6 months',
    blurb: 'Better value than monthly',
  },
  {
    id: 'yearly' as const,
    title: 'Yearly',
    price: `$${YEARLY_DISPLAY_USD}`,
    period: 'per year',
    blurb: 'Best value — set exact price in Lemon Squeezy',
  },
];

export default function SubscribePage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const startCheckout = async (plan: (typeof plans)[number]['id']) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/signin?next=/subscribe');
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Could not start checkout');
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      throw new Error('No checkout URL returned');
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Checkout failed', 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Choose a plan</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            New accounts get a <strong>30-day free trial</strong>. After the trial, pick a paid plan to keep using the
            dashboard, sites, and analytics.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {plans.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col"
            >
              <h2 className="text-lg font-semibold text-slate-900">{p.title}</h2>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {p.price}
                <span className="text-base font-normal text-slate-500"> {p.period}</span>
              </p>
              <p className="mt-2 text-sm text-slate-500 flex-1">{p.blurb}</p>
              <Button
                variant="primary"
                className="w-full mt-6"
                disabled={loading !== null}
                onClick={() => startCheckout(p.id)}
              >
                {loading === p.id ? 'Redirecting…' : 'Continue to checkout'}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500">
          Payments are processed securely by Lemon Squeezy.{' '}
          <Link href="/pricing" className="text-indigo-600 hover:underline">
            Pricing details
          </Link>
          {' · '}
          <Link href="/dashboard" className="text-indigo-600 hover:underline">
            Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
