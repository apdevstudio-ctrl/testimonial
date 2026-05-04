import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Integration guide',
  description: 'Step-by-step guide to embedding the TestiFlow testimonial widget and connecting your site.',
  alternates: { canonical: '/integration-guide' },
  openGraph: { url: '/integration-guide', title: 'Integration guide | TestiFlow' },
}

export default function IntegrationGuideLayout({ children }: { children: React.ReactNode }) {
  return children
}
