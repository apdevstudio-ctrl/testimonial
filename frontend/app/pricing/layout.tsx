import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'TestiFlow subscription plans—choose monthly, 6-month, or yearly billing for testimonial collection and widgets.',
  alternates: { canonical: '/pricing' },
  openGraph: { url: '/pricing', title: 'Pricing | TestiFlow' },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
