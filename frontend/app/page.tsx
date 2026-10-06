import type { Metadata } from 'next';
import PremiumLanding from '@/components/landing/PremiumLanding';
import { getSiteUrl } from '@/lib/seo/siteUrl';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: 'TestiFlow — Put customer quotes on your site',
  description:
    'Paste the testimonials you already have. Publish a Wall of Love and embed it on Framer, Webflow, or Next.js. 30 days free.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'TestiFlow — Put customer quotes on your site',
    description:
      'Paste the testimonials you already have. Publish a Wall of Love and embed it on Framer, Webflow, or Next.js.',
    url: site,
    siteName: 'TestiFlow',
    type: 'website',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'TestiFlow' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TestiFlow — Put customer quotes on your site',
    description:
      'Paste the testimonials you already have. Publish a Wall of Love and embed it on Framer, Webflow, or Next.js.',
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return <PremiumLanding />;
}
