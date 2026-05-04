import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscribe',
  description: 'Subscribe to TestiFlow to collect unlimited testimonials, video reviews, and embeddable widgets.',
  alternates: { canonical: '/subscribe' },
  openGraph: { url: '/subscribe', title: 'Subscribe | TestiFlow' },
}

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return children
}
