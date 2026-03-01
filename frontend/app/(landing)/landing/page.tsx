'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Check, Video, Copy, CheckCircle, Moon, Sun, 
  Zap, Shield, Palette, BarChart3, Layout, Sparkles, 
  Star, Play, X, Code, Globe, ShoppingBag, FileCode, 
  Layers, MessageSquare, TrendingUp, Clock, Users
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [previewTheme, setPreviewTheme] = useState('#6366f1');
  const [previewLayout, setPreviewLayout] = useState<'grid' | 'slider' | 'wall'>('grid');
  const [isDarkPreview, setIsDarkPreview] = useState(false);
  const { showToast } = useToast();
  const exitIntentRef = useRef(false);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Exit intent detection
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
    const script = '<script src="https://testiflow.site/embed.js"></script>';
    navigator.clipboard.writeText(script);
    setCopied(true);
    showToast('Script copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    {
      icon: Zap,
      title: 'One-Click Embed',
      description: 'Add a single script tag to your website and start collecting testimonials instantly.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Auto Moderation',
      description: 'AI-powered spam detection and content moderation to keep your testimonials authentic.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Match your brand colors, fonts, and styles. Fully customizable widget design.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track views, clicks, submissions, and conversion rates with detailed analytics.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Layout,
      title: 'Multiple Layouts',
      description: 'Choose from grid, carousel, list, or wall layouts. Perfect for any website design.',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      icon: Sparkles,
      title: 'Spam Protection',
      description: 'Built-in rate limiting and verification to prevent spam and fake testimonials.',
      color: 'from-red-400 to-rose-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Collect Testimonials',
      description: 'Add our script to your website. Customers can submit video or text testimonials with one click.',
      icon: MessageSquare
    },
    {
      number: '02',
      title: 'Approve & Manage',
      description: 'Review submissions in your dashboard. Approve, edit, or moderate testimonials before publishing.',
      icon: CheckCircle
    },
    {
      number: '03',
      title: 'Embed Anywhere',
      description: 'Display testimonials anywhere on your site with customizable layouts and themes.',
      icon: Globe
    }
  ];

  const integrations = [
    { name: 'WordPress', icon: '📝' },
    { name: 'Shopify', icon: '🛒' },
    { name: 'Webflow', icon: '🎨' },
    { name: 'HTML', icon: '🌐' },
    { name: 'React', icon: '⚛️' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Founder, TechStart',
      text: 'TestiFlow increased our conversion rate by 32%. The setup was incredibly easy!',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CEO, DesignCo',
      text: 'Beautiful testimonials that match our brand perfectly. Our customers love it.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Johnson',
      role: 'Marketing Director',
      text: 'The analytics dashboard gives us insights we never had before. Highly recommended!',
      rating: 5,
      avatar: '👩‍🎨'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        'Up to 10 testimonials',
        'Basic widget',
        'Email support',
        'Standard layouts'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For growing businesses',
      features: [
        'Unlimited testimonials',
        'Custom branding',
        'Analytics dashboard',
        'All layouts',
        'Priority support',
        'Video testimonials'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Business',
      price: '$99',
      period: '/month',
      description: 'For agencies & enterprises',
      features: [
        'Everything in Pro',
        'White-label option',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Advanced analytics'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-950' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors ${
        darkMode 
          ? 'bg-slate-950/90 border-slate-800/50 backdrop-blur-xl' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
              <Link href="/landing" className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TestiFlow
              </div>
              </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className={`transition-colors ${darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Features
              </Link>
              <Link href="#pricing" className={`transition-colors ${darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Pricing
              </Link>
              <Link href="#integrations" className={`transition-colors ${darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Integrations
              </Link>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-slate-300 hover:bg-slate-800/50 hover:text-yellow-400' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link href="/signin" className={`transition-colors ${darkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Sign In
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Start Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative overflow-hidden py-20 lg:py-32 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-950 via-indigo-950/50 to-purple-950/50' 
          : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
      }`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${
                i % 2 === 0 ? 'bg-indigo-400' : 'bg-purple-400'
              }`}
              style={{
                width: `${200 + i * 100}px`,
                height: `${200 + i * 100}px`,
                left: `${i * 15}%`,
                top: `${i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                darkMode 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10' 
                  : 'bg-indigo-100 text-indigo-700'
              }`}>
                ✨ Boost conversion rate by up to 32% with social proof
              </span>
            </div>
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Collect & Showcase
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Testimonials in Seconds
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
              darkMode ? 'text-slate-300' : 'text-gray-600'
            }`}>
              One simple script. Beautiful testimonials. Instantly boost trust & conversions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="group">
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" size="lg" className={darkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-800/50' : ''}>
                  <Play className="mr-2 h-5 w-5" />
                  See Demo
                </Button>
              </Link>
            </div>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              No credit card required • Setup in 60 seconds
            </p>

            {/* Floating testimonial cards */}
            <div className="mt-16 relative h-64">
              {testimonials.slice(0, 3).map((testimonial, i) => (
                <div
                  key={i}
                  className={`absolute rounded-2xl p-6 shadow-2xl backdrop-blur-lg border transition-all hover:scale-105 animate-float ${
                    darkMode 
                      ? 'bg-slate-800/60 border-slate-700/50 backdrop-blur-xl shadow-indigo-500/10' 
                      : 'bg-white/90 border-gray-200'
                  }`}
                  style={{
                    width: '280px',
                    left: `${20 + i * 30}%`,
                    top: `${i * 20}px`,
                    animationDelay: `${i * 0.5}s`
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {testimonial.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`py-20 ${darkMode ? 'bg-slate-900/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Super Simple 3 Steps
            </h2>
            <p className={`text-xl ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Get started in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`relative rounded-2xl p-8 transition-all hover:scale-105 ${
                    darkMode 
                      ? 'bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 hover:border-slate-600/50 hover:shadow-xl hover:shadow-indigo-500/10' 
                      : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-gray-200'
                  }`}
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {step.number}
                  </div>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={darkMode ? 'text-slate-400' : 'text-gray-600'}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Code Snippet */}
          <div className={`max-w-2xl mx-auto rounded-2xl p-8 ${
            darkMode 
              ? 'bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Integration Code
              </h3>
              <button
                onClick={copyScript}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className={`rounded-lg p-4 font-mono text-sm overflow-x-auto ${
              darkMode ? 'bg-slate-950 border border-slate-700/50 text-slate-300' : 'bg-gray-900 text-gray-100'
            }`}>
              <code>{'<script src="https://testiflow.site/embed.js"></script>'}</code>
            </div>
          </div>
        </div>
      </section>

      {/* Live Widget Preview Section */}
      <section id="demo" className={`py-20 ${darkMode ? 'bg-slate-900/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Live Widget Preview
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Customize and see your testimonials in real-time
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className={`rounded-2xl p-8 ${
              darkMode ? 'bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm shadow-xl shadow-indigo-500/5' : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-xl font-semibold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Customize Preview
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Theme Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={previewTheme}
                      onChange={(e) => setPreviewTheme(e.target.value)}
                      className="h-12 w-20 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={previewTheme}
                      onChange={(e) => setPreviewTheme(e.target.value)}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Layout
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['grid', 'slider', 'wall'] as const).map((layout) => (
                      <button
                        key={layout}
                        onClick={() => setPreviewLayout(layout)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          previewLayout === layout
                            ? 'bg-indigo-600 text-white'
                            : darkMode
                            ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {layout.charAt(0).toUpperCase() + layout.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`flex items-center gap-3 cursor-pointer ${
                    darkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <input
                      type="checkbox"
                      checked={isDarkPreview}
                      onChange={(e) => setIsDarkPreview(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Dark Mode</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className={`rounded-2xl p-8 ${
              darkMode ? 'bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm shadow-xl shadow-indigo-500/5' : 'bg-white border border-gray-200'
            }`}>
              <h3 className={`text-xl font-semibold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Preview
              </h3>
              <div className={`rounded-lg p-6 ${
                isDarkPreview ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                {previewLayout === 'grid' && (
                  <div className="grid grid-cols-2 gap-4">
                    {testimonials.slice(0, 4).map((t, i) => (
                      <div
                        key={i}
                        className={`rounded-lg p-4 border ${
                          isDarkPreview 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                        }`}
                        style={{ borderTopColor: previewTheme, borderTopWidth: '3px' }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-2xl">{t.avatar}</div>
                          <div>
                            <div className={`text-sm font-semibold ${
                              isDarkPreview ? 'text-white' : 'text-gray-900'
                            }`}>
                              {t.name}
                            </div>
                            <div className={`text-xs ${
                              isDarkPreview ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {t.role}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[...Array(t.rating)].map((_, j) => (
                            <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className={`text-xs ${
                          isDarkPreview ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {t.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {previewLayout === 'slider' && (
                  <div className="relative overflow-hidden rounded-lg">
                    <div className="flex gap-4" style={{ width: `${testimonials.length * 2 * 100}%`, animation: 'slide 15s linear infinite' }}>
                      {[...testimonials, ...testimonials].map((t, i) => (
                        <div
                          key={i}
                          className={`flex-shrink-0 rounded-lg p-4 border ${
                            isDarkPreview 
                              ? 'bg-gray-800 border-gray-700' 
                              : 'bg-white border-gray-200'
                          }`}
                          style={{ 
                            borderLeftColor: previewTheme, 
                            borderLeftWidth: '4px',
                            width: `${100 / (testimonials.length * 2)}%`
                          }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="text-3xl">{t.avatar}</div>
                            <div>
                              <div className={`font-semibold ${
                                isDarkPreview ? 'text-white' : 'text-gray-900'
                              }`}>
                                {t.name}
                              </div>
                              <div className={`text-sm ${
                                isDarkPreview ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {t.role}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {[...Array(t.rating)].map((_, j) => (
                              <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className={isDarkPreview ? 'text-gray-300' : 'text-gray-600'}>
                            {t.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {previewLayout === 'wall' && (
                  <div className="space-y-4">
                    {testimonials.map((t, i) => (
                      <div
                        key={i}
                        className={`rounded-lg p-4 border-l-4 ${
                          isDarkPreview 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                        }`}
                        style={{ borderLeftColor: previewTheme }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="text-xl">{t.avatar}</div>
            <div>
                              <div className={`text-sm font-semibold ${
                                isDarkPreview ? 'text-white' : 'text-gray-900'
                              }`}>
                                {t.name}
                              </div>
                              <div className={`text-xs ${
                                isDarkPreview ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {t.role}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(t.rating)].map((_, j) => (
                              <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className={`text-sm ${
                          isDarkPreview ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {t.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Powerful Features
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need to collect and showcase testimonials
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group relative rounded-2xl p-8 transition-all hover:scale-105 hover:shadow-2xl ${
                    darkMode 
                      ? 'bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 hover:border-slate-600/50 hover:shadow-indigo-500/10' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={darkMode ? 'text-slate-400' : 'text-gray-600'}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className={`py-20 ${darkMode ? 'bg-slate-900/50' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                4.9/5
              </span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Trusted by 1,200+ brands
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Join thousands of companies using TestiFlow
            </p>
          </div>

          {/* Company Logos */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {['TechCorp', 'StartupHub', 'DesignCo', 'GrowthLab', 'InnovateNow'].map((company, i) => (
              <div
                key={i}
                className={`flex items-center justify-center h-20 rounded-lg ${
                  darkMode ? 'bg-slate-800/40 border border-slate-700/30' : 'bg-white'
                }`}
              >
                <span className={`text-lg font-semibold ${
                  darkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-20 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Simple, Transparent Pricing
              </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose the plan that&apos;s right for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 transition-all hover:scale-105 ${
                  plan.popular
                    ? darkMode
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-2 border-indigo-400 shadow-2xl shadow-indigo-500/30'
                      : 'bg-gradient-to-br from-indigo-600 to-purple-600 border-2 border-indigo-500'
                    : darkMode
                    ? 'bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 hover:shadow-xl hover:shadow-indigo-500/10'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={plan.popular ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={`mb-6 ${plan.popular ? 'text-indigo-100' : darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className={`ml-2 ${plan.popular ? 'text-indigo-100' : darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'
                        }`} />
                        <span className={plan.popular ? 'text-indigo-50' : darkMode ? 'text-slate-300' : 'text-gray-700'}>
                          {feature}
                        </span>
                  </li>
                ))}
              </ul>
                  <Link href={plan.name === 'Business' ? '/contact' : '/signup'}>
                    <Button
                      variant={plan.popular ? 'secondary' : 'primary'}
                      size="lg"
                      className="w-full"
                    >
                      {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integrations" className={`py-20 ${darkMode ? 'bg-slate-900/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Works Everywhere
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Integrate with your favorite platform in minutes
            </p>
          </div>

          {/* Integration Logos */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {integrations.map((integration, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all hover:scale-105 ${
                  darkMode ? 'bg-slate-800/40 border border-slate-700/30' : 'bg-white'
                }`}
              >
                <div className="text-4xl mb-2">{integration.icon}</div>
                <span className={`font-semibold ${
                  darkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  {integration.name}
                </span>
              </div>
            ))}
          </div>

          {/* Integration Guide Tabs */}
          <div className={`max-w-4xl mx-auto rounded-2xl p-8 ${
            darkMode ? 'bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm shadow-xl shadow-indigo-500/5' : 'bg-white border border-gray-200'
          }`}>
            <div className={`flex gap-2 mb-6 border-b ${
              darkMode ? 'border-slate-700/50' : 'border-gray-200'
            }`}>
              {['Copy-Paste Code', 'WordPress', 'Shopify'].map((tab, i) => (
                <button
                  key={i}
                  className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                    i === 0
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : darkMode
                      ? 'border-transparent text-gray-400 hover:text-gray-200'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className={`rounded-lg p-4 font-mono text-sm overflow-x-auto ${
              darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-900 text-gray-100'
            }`}>
              <code>{'<script src="https://testiflow.site/embed.js"></script>'}</code>
            </div>
            <div className="mt-4">
              <button
                onClick={copyScript}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600/50'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className={`py-20 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Powerful Dashboard
          </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage everything from one place
            </p>
          </div>

          <div className={`rounded-2xl overflow-hidden shadow-2xl ${
            darkMode ? 'bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm' : 'bg-white border border-gray-200'
          }`}>
            <div className={`p-4 border-b ${
              darkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-6 p-6">
              <div className={`md:col-span-1 rounded-lg p-4 ${
                darkMode ? 'bg-slate-800/40 border border-slate-700/30' : 'bg-gray-50'
              }`}>
                <div className="space-y-4">
                  {['Dashboard', 'Testimonials', 'Analytics', 'Settings'].map((item, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg ${
                        i === 0
                          ? darkMode
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-indigo-100 text-indigo-700'
                          : darkMode
                          ? 'text-slate-300'
                          : 'text-gray-700'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-3 space-y-6">
                <div className={`rounded-lg p-6 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className={`text-xl font-bold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Testimonial Management
                  </h3>
                  <div className="space-y-3">
                    {testimonials.slice(0, 3).map((t, i) => (
                      <div
                        key={i}
                        className={`rounded-lg p-4 ${
                          darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{t.avatar}</div>
                            <div>
                              <div className={`font-semibold ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {t.name}
                              </div>
                              <div className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {t.role}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(t.rating)].map((_, j) => (
                              <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {t.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`rounded-lg p-6 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className={`text-xl font-bold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Analytics Overview
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Views', value: '12.5K' },
                      { label: 'Clicks', value: '3.2K' },
                      { label: 'Submissions', value: '856' }
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className={`rounded-lg p-4 text-center ${
                          darkMode ? 'bg-slate-800/40 border border-slate-700/30' : 'bg-white'
                        }`}
                      >
                        <div className={`text-2xl font-bold mb-1 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {stat.value}
                        </div>
                        <div className={`text-sm ${
                          darkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${
        darkMode ? 'bg-slate-950 border-slate-800/50' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                TestiFlow
              </div>
              <p className={darkMode ? 'text-slate-400' : 'text-gray-600'}>
                Collect and showcase customer testimonials with ease.
              </p>
            </div>
            <div>
              <h4 className={`font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Product
              </h4>
              <ul className="space-y-2">
                {['Pricing', 'Features', 'Integrations', 'API'].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className={`transition-colors ${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Company
              </h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className={`transition-colors ${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Legal
              </h4>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Security'].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className={`transition-colors ${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={`border-t pt-8 text-center ${
            darkMode ? 'border-slate-800/50 text-slate-500' : 'border-gray-200 text-gray-600'
          }`}>
            <p>&copy; {new Date().getFullYear()} TestiFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button */}
      <Link
        href="/signup"
        className="fixed bottom-8 right-8 z-50 group"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-110 transition-transform">
          <Sparkles className="h-5 w-5" />
          <span className="font-semibold">Start Free</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

      {/* Exit Intent Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className={`relative max-w-md w-full rounded-2xl p-8 ${
            darkMode ? 'bg-slate-800/95 border border-slate-700/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/20' : 'bg-white'
          }`}>
            <button
              onClick={() => setShowExitPopup(false)}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className={`text-2xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Wait! Don&apos;t miss out
            </h3>
            <p className={`mb-6 ${
              darkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Start your free trial today and boost your conversion rate by up to 32%!
            </p>
            <div className="flex gap-4">
              <Link href="/signup" className="flex-1">
                <Button variant="primary" size="lg" className="w-full">
                  Start Free Trial
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowExitPopup(false)}
                className={darkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700/50' : ''}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
