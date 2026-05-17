'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Check, Zap, Shield, Palette, BarChart3, Layout, Sparkles,
  Star, MessageSquare, CheckCircle, Globe, X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { SIX_MONTH_DISPLAY_USD, YEARLY_DISPLAY_USD } from '@/lib/subscription/constants';
import LandingNav from '@/components/landing/LandingNav';
import LandingHero from '@/components/landing/LandingHero';
import LiveDemoGallery from '@/components/landing/LiveDemoGallery';
import ProductScreens from '@/components/landing/ProductScreens';

export default function PremiumLanding() {
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const { showToast } = useToast();
  const exitIntentRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentRef.current) {
        exitIntentRef.current = true;
        setShowExitPopup(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const copyScript = () => {
    navigator.clipboard.writeText('<script src="https://testiflow.site/embed.js" async></script>');
    setCopied(true);
    showToast('Script copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    { icon: Zap, title: 'One-line embed', description: 'Script, iframe, or React — works on any stack.', color: 'from-yellow-400 to-orange-500' },
    { icon: Shield, title: 'Moderation', description: 'Approve before publish. Rate limits built in.', color: 'from-green-400 to-emerald-500' },
    { icon: Palette, title: '8 premium themes', description: 'SaaS, glass, dark, ocean, bold, and more.', color: 'from-purple-400 to-pink-500' },
    { icon: BarChart3, title: 'Analytics', description: 'Wall views, impressions, and conversion funnel.', color: 'from-blue-400 to-cyan-500' },
    { icon: Layout, title: '8 layouts', description: 'Grid, bento, marquee, masonry, carousel, and more.', color: 'from-indigo-400 to-purple-500' },
    { icon: Sparkles, title: 'AI enrichment', description: 'Headlines, tags, and sentiment on testimonials.', color: 'from-red-400 to-rose-500' },
  ];

  const pricingPlans = [
    { name: 'Trial', price: 'Free', period: '30 days', features: ['Full dashboard', 'All widgets', 'Analytics', 'No card'], cta: 'Start trial', popular: false, href: '/signup' },
    { name: 'Monthly', price: '$5', period: '/mo', features: ['Unlimited testimonials', 'Video & text', 'Custom widgets', 'Lemon Squeezy'], cta: 'Get started', popular: false, href: '/signup' },
    { name: '6 months', price: `$${SIX_MONTH_DISPLAY_USD}`, period: '/6 mo', features: ['Everything monthly', 'Better value', 'One invoice', 'Priority support'], cta: 'Get started', popular: true, href: '/signup' },
    { name: 'Yearly', price: `$${YEARLY_DISPLAY_USD}`, period: '/yr', features: ['Lowest rate', 'Annual billing', 'All features', 'Best for teams'], cta: 'Get started', popular: false, href: '/signup' },
  ];

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-950 text-white' : 'bg-white'}`}>
      <LandingNav darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />

      <LandingHero darkMode={darkMode} onCopyScript={copyScript} copied={copied} />

      <LiveDemoGallery darkMode={darkMode} />

      <ProductScreens darkMode={darkMode} />

      <section id="features" className={`py-20 scroll-mt-24 ${darkMode ? 'bg-slate-900/30' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Everything you need for social proof
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`p-6 rounded-2xl border transition-all hover:-translate-y-1 ${
                    darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-indigo-500/50' : 'bg-white border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.color} text-white mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                  <p className={darkMode ? 'text-slate-400' : 'text-gray-600'}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className={`py-20 scroll-mt-24 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Simple pricing</h2>
            <p className={darkMode ? 'text-slate-400' : 'text-gray-600'}>Start free. Upgrade when you are ready.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border ${
                  plan.popular
                    ? 'border-indigo-500 shadow-xl shadow-indigo-500/20 scale-[1.02]'
                    : darkMode
                      ? 'border-slate-700 bg-slate-800/30'
                      : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                    Popular
                  </span>
                )}
                <h3 className={`font-semibold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                  <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className={`flex items-center gap-2 text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                      <Check className="h-4 w-4 text-indigo-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={`py-12 border-t ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              TestiFlow
            </span>
            <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Embeddable social proof for modern teams.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/docs" className={darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>Docs</Link>
            <Link href="/examples" className={darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>Examples</Link>
            <Link href="/integrations" className={darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>Integrations</Link>
          </div>
        </div>
      </footer>

      {showExitPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`max-w-md w-full rounded-2xl p-8 relative ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
            <button type="button" onClick={() => setShowExitPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Before you go</h3>
            <p className={`mb-6 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Start your free trial — full access, no credit card.</p>
            <Link href="/signup">
              <Button variant="primary" className="w-full">
                Start free <ArrowRight className="h-4 w-4 ml-2 inline" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
