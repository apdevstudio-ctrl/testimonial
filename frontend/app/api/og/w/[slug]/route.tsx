import { ImageResponse } from '@vercel/og';
import { loadPublicWall } from '@/lib/seo/walls';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const data = await loadPublicWall(params.slug);

  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            color: '#fff',
            fontSize: 32,
          }}
        >
          TestiFlow
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const { site, testimonials } = data;
  const featured = testimonials[0];
  const quote =
    featured?.text?.slice(0, 140) ||
    `See what customers say about ${site.name}`;
  const author = featured?.author?.name || 'Happy customer';
  const rating = featured?.rating ?? 5;
  const isDark =
    site.wallSettings?.themePreset === 'dark' ||
    site.wallSettings?.themePreset === 'bold';

  const bg = isDark
    ? 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #312e81 100%)'
    : 'linear-gradient(135deg, #eef2ff 0%, #faf5ff 50%, #ffffff 100%)';
  const textColor = isDark ? '#fafafa' : '#0f172a';
  const muted = isDark ? '#a1a1aa' : '#64748b';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 56,
          background: bg,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: textColor }}>{site.name}</div>
          <div style={{ fontSize: 20, color: '#6366f1', fontWeight: 600 }}>TestiFlow</div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          <div style={{ fontSize: 22, color: '#fbbf24' }}>
            {'★'.repeat(Math.round(rating))}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: textColor,
              lineHeight: 1.35,
              maxWidth: 900,
            }}
          >
            {`"${quote}"`}
          </div>
          <div style={{ fontSize: 22, color: muted }}>{`— ${author}`}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, color: muted }}>
          <span>Wall of Love</span>
          <span>{`${testimonials.length} testimonials`}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
