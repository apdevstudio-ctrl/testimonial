import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { AuthProvider } from '@/contexts/AuthContext'

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
  metadataBase: new URL('https://testiflow.site'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://testiflow.site',
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
      { url: '/favicon.png', sizes: 'any' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content="TestiFlow" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TestiFlow",
              "applicationCategory": "BusinessApplication",
              "description": "The easiest way to collect and display customer testimonials",
              "url": "https://testiflow.site",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "9",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "150"
              }
            }),
          }}
        />
      </head>
      <body className="bg-gray-50">
        <ToastProvider>
          <AuthProvider>
            <DashboardLayout>
              {children}
            </DashboardLayout>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}

