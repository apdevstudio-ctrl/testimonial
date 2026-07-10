const en = {
  language: {
    label: 'Language',
    select: 'Select language',
  },
  nav: {
    liveDemo: 'Live demo',
    features: 'Features',
    examples: 'Examples',
    playground: 'Playground',
    pricing: 'Pricing',
    signIn: 'Sign in',
    startFree: 'Start free',
    docs: 'Docs',
    integrations: 'Integrations',
    documentation: 'Documentation',
    integrationGuide: 'Integration guide',
    liveExamples: 'Live examples',
  },
  hero: {
    badge: 'Wall of Love infrastructure for modern SaaS',
    productHunt: "We're on Product Hunt",
    productHuntCta: 'Support us on Product Hunt',
    title: 'Social proof that',
    titleHighlight: 'converts',
    subtitle:
      'Collect video & text testimonials, publish SEO walls, and embed premium widgets — one script, every stack.',
    startTrial: 'Start free trial',
    liveDemo: 'Live demo',
    copied: 'Copied!',
    previewTitle: 'Live preview',
  },
  demo: {
    eyebrow: 'LIVE DEMO GALLERY',
    title: 'See widgets in action',
    subtitle: 'Switch themes and layouts instantly. Every preset is embeddable on your site in one line.',
    copyEmbed: 'Copy embed',
    allExamples: 'All examples',
    themesLabel: 'Themes',
  },
  features: {
    title: 'Everything you need for social proof',
    oneLineEmbed: 'One-line embed',
    oneLineEmbedDesc: 'Script, iframe, or React — works on any stack.',
    moderation: 'Moderation',
    moderationDesc: 'Approve before publish. Rate limits built in.',
    themes: '8 premium themes',
    themesDesc: 'SaaS, glass, dark, ocean, bold, and more.',
    analytics: 'Analytics',
    analyticsDesc: 'Wall views, impressions, and conversion funnel.',
    layouts: '8 layouts',
    layoutsDesc: 'Grid, bento, marquee, masonry, carousel, and more.',
    ai: 'AI enrichment',
    aiDesc: 'Headlines, tags, and sentiment on testimonials.',
  },
  pricing: {
    title: 'Simple pricing',
    subtitle: 'Start free. Upgrade when you are ready.',
    popular: 'Popular',
    trial: 'Trial',
    monthly: 'Monthly',
    sixMonths: '6 months',
    yearly: 'Yearly',
    free: 'Free',
    days30: '30 days',
    perMo: '/mo',
    per6Mo: '/6 mo',
    perYr: '/yr',
    startTrial: 'Start trial',
    getStarted: 'Get started',
    featFullDashboard: 'Full dashboard',
    featAllWidgets: 'All widgets',
    featAnalytics: 'Analytics',
    featNoCard: 'No card',
    featUnlimited: 'Unlimited testimonials',
    featVideoText: 'Video & text',
    featCustomWidgets: 'Custom widgets',
    featEverythingMonthly: 'Everything monthly',
    featBetterValue: 'Better value',
    featOneInvoice: 'One invoice',
    featPriority: 'Priority support',
    featLowestRate: 'Lowest rate',
    featAnnual: 'Annual billing',
    featAllFeatures: 'All features',
    featBestTeams: 'Best for teams',
  },
  footer: {
    tagline: 'Embeddable social proof for modern teams.',
  },
  exit: {
    title: 'Before you go',
    subtitle: 'Start your free trial — full access, no credit card.',
    cta: 'Start free',
  },
  toast: {
    scriptCopied: 'Script copied!',
  },
  common: {
    loading: 'Loading...',
    search: 'Search...',
    signOut: 'Sign out',
  },
  wallPreview: {
    title: 'Wall of Love',
    subtitle: 'Live on your site',
    verified: 'Verified',
  },
  docs: {
    subtitle: 'Documentation',
    playground: 'Interactive playground',
  },
};

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

export type Messages = DeepStringRecord<typeof en>;
export type MessageKey = string;

export default en;
