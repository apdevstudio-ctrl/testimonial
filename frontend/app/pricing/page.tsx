'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { SIX_MONTH_DISPLAY_USD, YEARLY_DISPLAY_USD } from '@/lib/subscription/constants';

export default function PricingPage() {
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

  const plans = [
    {
      title: 'Trial',
      price: 'Free',
      period: '30 days',
      note: 'Full product access. No card required to start.',
      href: '/signup',
      cta: 'Start free trial',
    },
    {
      title: 'One month',
      price: '$5',
      period: 'per month',
      note: 'Billed monthly via Lemon Squeezy.',
      href: '/signup',
      cta: 'Get started',
    },
    {
      title: '6 months',
      price: `$${SIX_MONTH_DISPLAY_USD}`,
      period: 'per 6 months',
      note: 'Mid-term commitment, better rate than monthly.',
      href: '/signup',
      cta: 'Get started',
    },
    {
      title: 'Yearly',
      price: `$${YEARLY_DISPLAY_USD}`,
      period: 'per year',
      note: 'Best value. Final price follows your Lemon Squeezy product.',
      href: '/signup',
      cta: 'Get started',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a <strong>30-day trial</strong>, then choose monthly, 6-month, or yearly billing. Payments run
            through Lemon Squeezy.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col"
            >
              <h2 className="text-lg font-semibold text-gray-900">{plan.title}</h2>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-1">
                <span className="text-3xl md:text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
              {plan.note ? <p className="mt-3 text-sm text-gray-500 flex-1">{plan.note}</p> : null}
              <ul className="mt-6 space-y-2">
                {features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <Check className="h-4 w-4 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="mt-8 block">
                <Button variant="primary" size="lg" className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
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
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How long is the trial?</h3>
              <p className="text-gray-600">
                New accounts get 30 days of full access. After that, choose a paid plan to continue.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                Whatever Lemon Squeezy supports for your store (cards, etc.). Invoices and receipts are in the Lemon
                Squeezy customer portal.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel?</h3>
              <p className="text-gray-600">
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
