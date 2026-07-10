import type { Metadata } from 'next';
import IntegrationsNav from '@/components/integrations/IntegrationsNav';

export const metadata: Metadata = {
  title: 'Integrations',
};

export default function IntegrationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IntegrationsNav />
      {children}
    </>
  );
}
