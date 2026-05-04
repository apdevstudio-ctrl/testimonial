import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

/** Root only redirects; avoid indexing a thin URL—canonical is the marketing page. */
export const metadata: Metadata = {
  alternates: { canonical: '/landing' },
  robots: { index: false, follow: true },
}

export default function Home() {
  redirect('/landing')
}
