import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { AuthProvider } from '@/contexts/AuthContext'
import AppProviders from '@/components/providers/AppProviders'
import { LOCALE_COOKIE, resolveLocale } from '@/lib/i18n/config'
import { getMetadataBase, getSiteUrl } from '@/lib/seo/siteUrl'

export const metadata: Metadata = {
  title: {
    default: 'TestiFlow - Collect & Display Customer Testimonials',
    template: '%s | TestiFlow'
  },
  description: 'TestiFlow.site - The easiest way to collect and display customer testimonials. Video and text testimonials, beautiful displays, easy integration. Start building trust today.',
  keywords: ['testimonials', 'customer reviews', 'video testimonials', 'testimonial widget', 'social proof', 'customer feedback', 'review collection', 'testimonial software', 'testiflow'],
  authors: [{ name: 'TestiFlow' }],
  creator: 'TestiFlow',
  publisher: 'TestiFlow',
  metadataBase: getMetadataBase(),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'TestiFlow',
    title: 'TestiFlow - Collect & Display Customer Testimonials',
    description: 'The easiest way to collect and display customer testimonials. Video and text testimonials, beautiful displays, easy integration.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'TestiFlow - Testimonial Collection Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TestiFlow - Collect & Display Customer Testimonials',
    description: 'The easiest way to collect and display customer testimonials. Video and text testimonials, beautiful displays, easy integration.',
    images: ['/logo.png'],
    creator: '@testiflow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.trim(),
        },
      }
    : {}),
}

const ahrefsKey = process.env.NEXT_PUBLIC_AHREFS_WEB_ANALYTICS_KEY?.trim()

function structuredDataJsonLd() {
  const site = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site}/#organization`,
        name: 'TestiFlow',
        url: site,
        logo: { '@type': 'ImageObject', url: `${site}/logo.png` },
      },
      {
        '@type': 'WebSite',
        '@id': `${site}/#website`,
        url: site,
        name: 'TestiFlow',
        description:
          'Collect and display customer testimonials with video and text, widgets, and easy integration.',
        publisher: { '@id': `${site}/#organization` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'TestiFlow',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free trial and paid plans' },
        url: site,
      },
    ],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialLocale = resolveLocale(cookies().get(LOCALE_COOKIE)?.value)

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content="TestiFlow" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('testiflow_theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataJsonLd()),
          }}
        />
        {ahrefsKey ? (
          <script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key={ahrefsKey}
            async
          />
        ) : null}
      </head>
      <body className="bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-gray-100">
        <AppProviders initialLocale={initialLocale}>
          <ToastProvider>
            <AuthProvider>
              <DashboardLayout>
                {children}
              </DashboardLayout>
            </AuthProvider>
          </ToastProvider>
        </AppProviders>
      </body>
    </html>
  )
}

