/** Canonical site origin (no trailing slash). Used for metadata, sitemap, and JSON-LD. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://testiflow.site'
  return raw.replace(/\/$/, '')
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteUrl()}/`)
}
