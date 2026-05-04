import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collect & display customer testimonials',
  description:
    'TestiFlow helps you collect video and text testimonials, manage them in one place, and embed beautiful widgets—no code headaches.',
  alternates: { canonical: '/landing' },
  openGraph: {
    title: 'TestiFlow — Collect & display customer testimonials',
    description:
      'Video and text testimonials, customizable widgets, and simple integration. Build trust with social proof.',
    url: '/landing',
  },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  );
}
