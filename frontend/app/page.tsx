import type { Metadata } from 'next';
import PremiumLanding from '@/components/landing/PremiumLanding';
import { getSiteUrl } from '@/lib/seo/siteUrl';

const site = getSiteUrl();

export const metadata: Metadata = {
  title: 'TestiFlow — Embeddable Social Proof & Wall of Love',
  description:
    'Collect video and text testimonials, publish SEO-indexable walls, and embed premium widgets on any website. Developer-friendly, one script, every stack.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'TestiFlow — Embeddable Social Proof & Wall of Love',
    description:
      'Collect video and text testimonials, publish SEO walls, and embed premium widgets on any site.',
    url: site,
    siteName: 'TestiFlow',
    type: 'website',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'TestiFlow' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TestiFlow — Embeddable Social Proof & Wall of Love',
    description:
      'Collect video and text testimonials, publish SEO walls, and embed premium widgets on any site.',
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return <PremiumLanding />;
}
