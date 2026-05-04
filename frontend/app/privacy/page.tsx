import type { Metadata } from 'next';
import LegalDocShell from '@/components/legal/LegalDocShell';
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent';
import { LEGAL_LAST_UPDATED } from '@/lib/legal/lastUpdated';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How TestiFlow collects, uses, and protects your data when you use our testimonial collection and management platform.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | TestiFlow',
    description:
      'How TestiFlow collects, uses, and protects your data when you use our testimonial collection and management platform.',
    url: '/privacy',
    type: 'article',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocShell variant="privacy">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-10">Last updated: {LEGAL_LAST_UPDATED}</p>
      <PrivacyPolicyContent />
    </LegalDocShell>
  );
}
