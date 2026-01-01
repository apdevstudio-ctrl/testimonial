'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start collecting and displaying testimonials today. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-600 overflow-hidden">
            {/* Popular Badge */}
            <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
              Most Popular
            </div>

            {/* Pricing Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">$9</span>
                  <span className="text-xl text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-gray-600 mt-2">Billed monthly</p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href="/signup" className="block">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Get Started
                </Button>
              </Link>

              <p className="text-center text-sm text-gray-500 mt-4">
                No credit card required for trial
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I change my plan later?
                </h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards and debit cards. All payments are processed securely.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  Yes! You can start with a 14-day free trial. No credit card required.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600">
                  Absolutely. You can cancel your subscription at any time with no penalties or fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

