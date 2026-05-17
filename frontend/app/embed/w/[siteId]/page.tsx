import { notFound } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Site from '@/lib/models/Site';
import Testimonial from '@/lib/models/Testimonial';
import WallViewer from '@/components/wall/WallViewer';
import type { WidgetThemePreset } from '@/lib/widgetThemes';
import type { WidgetCustomizeConfig } from '@/lib/widget/customizer';
import { WALL_REVALIDATE_SECONDS } from '@/lib/seo/walls';

export const revalidate = WALL_REVALIDATE_SECONDS;

interface PageProps {
  params: { siteId: string };
  searchParams: { theme?: string; layout?: string };
}

export default async function EmbedWallPage({ params, searchParams }: PageProps) {
  await connectDB();
  const site = await Site.findOne({ siteId: params.siteId, isActive: true }).lean();
  if (!site || site.wallSettings?.isPublic === false) notFound();

  const limit = site.wallSettings?.limit ?? 24;
  const testimonials = await Testimonial.find({
    siteId: site.siteId,
    isPublished: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const themePreset = (
    searchParams.theme ||
    site.wallSettings?.themePreset ||
    'saas'
  ) as WidgetThemePreset;
  const layout = (searchParams.layout ||
    site.wallSettings?.layout ||
    'grid') as WidgetCustomizeConfig['layout'];

  return (
    <WallViewer
      siteId={site.siteId}
      testimonials={JSON.parse(JSON.stringify(testimonials))}
      themePreset={themePreset}
      layout={layout}
      title={site.wallSettings?.title}
      subtitle={site.wallSettings?.subtitle}
      columns={site.testimonialDisplay?.columns ?? 3}
      compact
      customize={{
        hideBranding: site.wallSettings?.hideBranding,
        ...(site.widgetCustomization as object),
      }}
    />
  );
}
