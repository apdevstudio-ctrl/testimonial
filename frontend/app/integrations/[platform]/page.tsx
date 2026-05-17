import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IntegrationPageContent from '@/components/integrations/IntegrationPageContent';
import { getPlatform, INTEGRATION_PLATFORMS } from '@/lib/integrations/platforms';

interface PageProps {
  params: { platform: string };
}

export function generateStaticParams() {
  return INTEGRATION_PLATFORMS.map((p) => ({ platform: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const platform = getPlatform(params.platform);
  if (!platform) return { title: 'Integration' };
  return {
    title: `${platform.name} testimonial widget integration`,
    description: platform.description,
    alternates: { canonical: `/integrations/${platform.slug}` },
  };
}

export default function IntegrationPlatformPage({ params }: PageProps) {
  const platform = getPlatform(params.platform);
  if (!platform) notFound();
  return <IntegrationPageContent platform={platform} />;
}
