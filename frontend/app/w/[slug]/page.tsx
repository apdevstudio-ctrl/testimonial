import { notFound } from 'next/navigation';
import {
  loadPublicWall,
  buildWallMetadata,
  buildPrivateWallMetadata,
  WALL_REVALIDATE_SECONDS,
} from '@/lib/seo/walls';
import WallViewer from '@/components/wall/WallViewer';
import type { WidgetThemePreset } from '@/lib/widgetThemes';
import type { Metadata } from 'next';

export const revalidate = WALL_REVALIDATE_SECONDS;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await loadPublicWall(params.slug);
  if (!data) return buildPrivateWallMetadata();
  const quote = data.testimonials[0]?.text;
  return buildWallMetadata(
    { name: data.site.name, publicSlug: data.site.publicSlug, wallSettings: data.site.wallSettings },
    params.slug,
    quote
  );
}

export default async function PublicWallPage({ params }: PageProps) {
  const data = await loadPublicWall(params.slug);
  if (!data) notFound();

  const { site, testimonials } = data;
  const themePreset = (site.wallSettings?.themePreset || 'saas') as WidgetThemePreset;
  const layout = (site.wallSettings?.layout || 'grid') as
    | 'grid'
    | 'carousel'
    | 'marquee'
    | 'list'
    | 'bento'
    | 'masonry'
    | 'floating'
    | 'columns';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: site.wallSettings?.title || 'Customer Testimonials',
    itemListElement: testimonials.slice(0, 10).map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Review',
        reviewBody: t.text,
        author: t.author?.name ? { '@type': 'Person', name: t.author.name } : undefined,
        reviewRating: t.rating
          ? { '@type': 'Rating', ratingValue: t.rating, bestRating: 5 }
          : undefined,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WallViewer
        siteId={site.siteId}
        testimonials={JSON.parse(JSON.stringify(testimonials))}
        themePreset={themePreset}
        layout={layout}
        title={site.wallSettings?.title}
        subtitle={site.wallSettings?.subtitle}
        columns={site.testimonialDisplay?.columns ?? 3}
        customize={{
          hideBranding: site.wallSettings?.hideBranding,
        }}
      />
    </>
  );
}
