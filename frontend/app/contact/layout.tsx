import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with TestiFlow for support, sales, or partnership questions.',
  alternates: { canonical: '/contact' },
  openGraph: { url: '/contact', title: 'Contact | TestiFlow' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
