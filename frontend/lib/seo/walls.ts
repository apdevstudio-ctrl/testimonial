import connectDB from '@/lib/db/mongoose';
import Site from '@/lib/models/Site';
import Testimonial from '@/lib/models/Testimonial';
import { getSiteUrl } from '@/lib/seo/siteUrl';
import { normalizePublicSlug } from '@/lib/seo/slug';
import type { Metadata } from 'next';

export const WALL_REVALIDATE_SECONDS = 3600;

export interface PublicWallSite {
  siteId: string;
  name: string;
  publicSlug: string;
  wallSettings?: {
    isPublic?: boolean;
    title?: string;
    subtitle?: string;
    themePreset?: string;
    layout?: string;
    limit?: number;
    hideBranding?: boolean;
  };
  updatedAt?: Date;
}

export async function getPublicWallSites(): Promise<PublicWallSite[]> {
  await connectDB();
  const sites = await Site.find({
    isActive: true,
    'wallSettings.isPublic': { $ne: false },
  })
    .select('siteId name publicSlug wallSettings updatedAt')
    .lean();

  return sites.map((s) => ({
    siteId: s.siteId,
    name: s.name,
    publicSlug: s.publicSlug || normalizePublicSlug(s.name, s.siteId),
    wallSettings: s.wallSettings,
    updatedAt: s.updatedAt,
  }));
}

export async function loadPublicWall(slug: string) {
  await connectDB();
  const normalized = normalizePublicSlug(slug, slug);
  const site = await Site.findOne({
    isActive: true,
    $or: [
      { publicSlug: normalized },
      { publicSlug: slug },
      { siteId: slug },
    ],
  }).lean();

  if (!site || site.wallSettings?.isPublic === false) return null;

  const limit = site.wallSettings?.limit ?? 24;
  const testimonials = await Testimonial.find({
    siteId: site.siteId,
    isPublished: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const publicSlug = site.publicSlug || normalizePublicSlug(site.name, site.siteId);

  return { site: { ...site, publicSlug }, testimonials };
}

export function buildWallMetadata(
  site: { name: string; publicSlug: string; wallSettings?: PublicWallSite['wallSettings'] },
  slug: string,
  featuredQuote?: string
): Metadata {
  const siteName = site.name;
  const title = `Customer Testimonials – ${siteName} | TestiFlow`;
  const description =
    site.wallSettings?.subtitle ||
    featuredQuote?.slice(0, 155) ||
    `Read verified customer testimonials and reviews for ${siteName}.`;
  const canonical = `/w/${site.publicSlug || slug}`;
  const base = getSiteUrl();
  const ogImage = `${base}/api/og/w/${encodeURIComponent(site.publicSlug || slug)}`;

  const keywords = [
    `${siteName} testimonials`,
    `${siteName} reviews`,
    'customer testimonials',
    'wall of love',
    'social proof',
    'TestiFlow',
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${base}${canonical}`,
      siteName: 'TestiFlow',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export function buildPrivateWallMetadata(): Metadata {
  return {
    title: 'Private wall',
    robots: { index: false, follow: false },
  };
}
