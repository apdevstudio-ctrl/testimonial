/** SEO-safe slug: lowercase, alphanumeric + hyphens, max 80 chars */
export function normalizePublicSlug(input: string, fallback: string): string {
  const raw = (input || fallback)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return raw || fallback.slice(0, 12);
}

export function isValidPublicSlug(slug: string): boolean {
  return /^[a-z0-9]([a-z0-9-]{0,78}[a-z0-9])?$/.test(slug);
}
