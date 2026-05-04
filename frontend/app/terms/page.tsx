import type { Metadata } from 'next';
import LegalDocShell from '@/components/legal/LegalDocShell';
import TermsOfServiceContent from '@/components/legal/TermsOfServiceContent';
import { LEGAL_LAST_UPDATED } from '@/lib/legal/lastUpdated';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms governing your use of TestiFlow: accounts, subscriptions, acceptable use, and limitations of liability.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service | TestiFlow',
    description:
      'Terms governing your use of TestiFlow: accounts, subscriptions, acceptable use, and limitations of liability.',
    url: '/terms',
    type: 'article',
  },
};

export default function TermsOfServicePage() {
  return (
    <LegalDocShell variant="terms">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-10">Last updated: {LEGAL_LAST_UPDATED}</p>
      <TermsOfServiceContent />
    </LegalDocShell>
  );
}
