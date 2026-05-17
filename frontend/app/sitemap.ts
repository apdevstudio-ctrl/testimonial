import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo/siteUrl';
import { getPublicWallSites } from '@/lib/seo/walls';
import { INTEGRATION_PLATFORMS } from '@/lib/integrations/platforms';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${base}/landing`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/wall-of-love`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/integrations`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/compare/testimonial-to`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/docs/playground`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/examples`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/integration-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const integrationPaths: MetadataRoute.Sitemap = INTEGRATION_PLATFORMS.map((p) => ({
    url: `${base}/integrations/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const docSlugs = [
    'getting-started',
    'embed-guide',
    'react-sdk',
    'nextjs',
    'api',
    'webhooks',
    'themes',
    'layouts',
    'seo',
    'troubleshooting',
  ];
  const docPaths: MetadataRoute.Sitemap = docSlugs.map((slug) => ({
    url: `${base}/docs/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.65,
  }));

  let wallPaths: MetadataRoute.Sitemap = [];
  try {
    const publicWalls = await getPublicWallSites();
    wallPaths = publicWalls.flatMap((site) => {
      const slug = site.publicSlug;
      const modified = site.updatedAt ? new Date(site.updatedAt) : now;
      return [
        {
          url: `${base}/w/${slug}`,
          lastModified: modified,
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        },
        {
          url: `${base}/embed/w/${site.siteId}`,
          lastModified: modified,
          changeFrequency: 'weekly' as const,
          priority: 0.5,
        },
      ];
    });
  } catch (e) {
    console.error('Sitemap: failed to load public walls', e);
  }

  return [...staticPaths, ...integrationPaths, ...docPaths, ...wallPaths];
}
