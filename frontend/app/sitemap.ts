import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/seo/siteUrl'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const now = new Date()

  const paths = [
    '/landing',
    '/contact',
    '/pricing',
    '/subscribe',
    '/integration-guide',
    '/privacy',
    '/terms',
  ]

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/landing' ? ('weekly' as const) : ('monthly' as const),
    priority: path === '/landing' ? 1 : 0.7,
  }))
}
