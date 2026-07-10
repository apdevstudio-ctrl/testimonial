'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { SIX_MONTH_DISPLAY_USD, YEARLY_DISPLAY_USD } from '@/lib/subscription/constants';

function readHasToken() {
  try {
    return Boolean(localStorage.getItem('auth_token'));
  } catch {
    return false;
  }
}

export default function PricingPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(readHasToken());
  }, [token, isAuthenticated]);

  const loggedIn = isAuthenticated || Boolean(token) || hasToken;

  const features = [
    'Unlimited testimonials',
    'Video & text testimonials',
    'Customizable widget',
    'Analytics dashboard',
    'Email notifications',
    'API access',
    'Custom domain support',
    'Priority support',
  ];

  const goTrial = () => {
    router.push(loggedIn || readHasToken() ? '/dashboard' : '/signup');
  };

  const goPaid = () => {
    router.push(loggedIn || readHasToken() ? '/subscribe' : '/signup');
  };

  const plans = [
    {
      title: 'Trial',
      price: 'Free',
      period: '30 days',
      note: 'Full product access. No card required to start.',
      onClick: goTrial,
      cta: loggedIn ? 'Go to dashboard' : 'Start free trial',
    },
    {
      title: 'One month',
      price: '$5',
      period: 'per month',
      note: 'Billed monthly via Lemon Squeezy.',
      onClick: goPaid,
      cta: loggedIn ? 'Continue to checkout' : 'Get started',
    },
    {
      title: '6 months',
      price: `$${SIX_MONTH_DISPLAY_USD}`,
      period: 'per 6 months',
      note: 'Mid-term commitment, better rate than monthly.',
      onClick: goPaid,
      cta: loggedIn ? 'Continue to checkout' : 'Get started',
    },
    {
      title: 'Yearly',
      price: `$${YEARLY_DISPLAY_USD}`,
      period: 'per year',
      note: 'Best value. Final price follows your Lemon Squeezy product.',
      onClick: goPaid,
      cta: loggedIn ? 'Continue to checkout' : 'Get started',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 dark:from-slate-950 to-white dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start with a <strong>30-day trial</strong>, then choose monthly, 6-month, or yearly billing. Payments run
            through Lemon Squeezy.
          </p>
          {loggedIn ? (
            <p className="mt-4 text-sm text-indigo-600 dark:text-indigo-400">
              You&apos;re signed in — trial takes you to the dashboard; paid plans open checkout.
            </p>
          ) : null}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 flex flex-col"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.title}</h2>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-1">
                <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
              </div>
              {plan.note ? <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex-1">{plan.note}</p> : null}
              <ul className="mt-6 space-y-2">
                {features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full mt-8"
                onClick={plan.onClick}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {loggedIn ? (
            <>
              <Link href="/subscribe">
                <Button variant="secondary" size="lg">
                  Manage subscription
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg">
                  Back to dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/subscribe">
                <Button variant="secondary" size="lg">
                  Already signed up? Pay here
                </Button>
              </Link>
              <Link href="/signin?next=/subscribe">
                <Button variant="secondary" size="lg">
                  Sign in to subscribe
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently asked questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How long is the trial?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                New accounts get 30 days of full access. After that, choose a paid plan to continue.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Whatever Lemon Squeezy supports for your store (cards, etc.). Invoices and receipts are in the Lemon
                Squeezy customer portal.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I cancel?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes — manage or cancel from the billing portal. Access typically continues through the period you have
                already paid for.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
