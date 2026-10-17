'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { SIX_MONTH_DISPLAY_USD, YEARLY_DISPLAY_USD } from '@/lib/subscription/constants';
import { trackClarity } from '@/lib/analytics/clarity';

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
    const destination = loggedIn || readHasToken() ? '/dashboard' : '/signup';
    trackClarity('pricing_cta', { plan: 'trial', destination });
    router.push(destination);
  };

  const goPaid = () => {
    const destination = loggedIn || readHasToken() ? '/subscribe' : '/signup';
    trackClarity('pricing_cta', { plan: 'paid', destination });
    router.push(destination);
  };

  const plans = [
    {
      title: 'Trial',
      price: 'Free',
      period: '30 days',
      note: 'Full product access for 30 days. No card required. “Powered by TestiFlow” stays on until you pay.',
      onClick: goTrial,
      cta: loggedIn ? 'Go to dashboard' : 'Start free trial',
    },
    {
      title: 'One month',
      price: '$5',
      period: 'per month',
      note: '$60 if you stay a year. You can stop any month. Six months is a lower monthly rate.',
      onClick: goPaid,
      cta: loggedIn ? 'Continue to checkout' : 'Get started',
    },
    {
      title: '6 months',
      price: `$${SIX_MONTH_DISPLAY_USD}`,
      period: 'per 6 months',
      note: '$28 over 6 months is about $4.67 per month. Same features as monthly.',
      onClick: goPaid,
      cta: loggedIn ? 'Continue to checkout' : 'Get started',
    },
    {
      title: 'Yearly',
      price: `$${YEARLY_DISPLAY_USD}`,
      period: 'per year',
      note: '$55 per year is about $4.58 per month. That is less than paying $5 each month.',
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
            Start with a <strong>30-day trial</strong>. Yearly is the lowest rate at $55, about $4.58/month.
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Which plan costs less?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monthly is $5, or $60 over a year. Six months is $28, about $4.67 per month. Yearly is $55, about
                $4.58 per month. Every paid plan includes the same product. The TestiFlow link on your wall comes off
                only after you pay.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Does the wall stay up?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                A published wall keeps loading. After the trial, the dashboard locks until you choose a paid plan.
                During the trial, “Powered by TestiFlow” stays on the wall.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I cancel?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes. Manage or cancel from the billing portal. Access continues through the period you have already
                paid for.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
