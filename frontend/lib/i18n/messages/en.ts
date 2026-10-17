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
    startFree: 'Build my wall',
    docs: 'Docs',
    integrations: 'Integrations',
    documentation: 'Documentation',
    integrationGuide: 'Integration guide',
    liveExamples: 'Live examples',
  },
  hero: {
    badge: 'For indie SaaS sites',
    productHunt: "We're on Product Hunt",
    productHuntCta: 'Support us on Product Hunt',
    title: 'Your customers already said it.',
    titleHighlight: 'Put it on your site.',
    subtitle:
      'Paste the quotes sitting in your inbox. Publish a Wall of Love and embed it on Framer, Webflow, or Next.js. 30 days free, no card.',
    startTrial: 'Build my wall',
    liveDemo: 'See a live wall',
    copied: 'Copied!',
    previewTitle: 'Live preview',
  },
  demo: {
    eyebrow: 'SAMPLE LAYOUT',
    title: 'See the widget',
    subtitle:
      'Sample layout. These people are not TestiFlow customers. Switch themes to see how a wall looks before you add real quotes.',
    copyEmbed: 'Copy embed',
    allExamples: 'All examples',
    themesLabel: 'Themes',
  },
  features: {
    title: 'From quotes to a live wall',
    oneLineEmbed: 'Add the quotes you already have',
    oneLineEmbedDesc: 'Paste text, or send customers one link. Nothing goes live until you approve it.',
    moderation: 'Publish a Wall of Love',
    moderationDesc: 'A public page and an embed. Approve a new quote and the wall updates.',
    themes: 'Drop in one snippet',
    themesDesc: 'Framer, Webflow, and Next.js. No app install.',
    analytics: 'Analytics',
    analyticsDesc: 'Wall views, impressions, and conversion funnel.',
    layouts: '8 layouts',
    layoutsDesc: 'Grid, bento, marquee, masonry, carousel, and more.',
    ai: 'AI enrichment',
    aiDesc: 'Headlines, tags, and sentiment on testimonials.',
  },
  pricing: {
    title: 'Simple pricing',
    subtitle:
      '30-day trial, no card. Yearly is the lowest rate at $55, about $4.58/month.',
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
    featBetterValue: '$4.67/mo equivalent',
    featOneInvoice: 'One invoice',
    featPriority: 'Priority support',
    featLowestRate: '$4.58/mo equivalent',
    featAnnual: 'Annual billing',
    featAllFeatures: 'All features',
    featBestTeams: 'Same features as monthly',
  },
  footer: {
    tagline: 'A Wall of Love for indie SaaS sites.',
  },
  exit: {
    title: 'Your quotes can be on the site today',
    subtitle: '30 days free. No card. Paste a quote and publish a wall.',
    cta: 'Build my wall',
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
