import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Site from '@/lib/models/Site';
import Testimonial from '@/lib/models/Testimonial';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const slug = params.slug;
    const site = await Site.findOne({
      $or: [{ publicSlug: slug }, { siteId: slug }],
      isActive: true,
    }).lean();

    if (!site) {
      return NextResponse.json({ error: 'Wall not found' }, { status: 404 });
    }

    if (site.wallSettings?.isPublic === false) {
      return NextResponse.json({ error: 'This wall is private' }, { status: 403 });
    }

    const limit = site.wallSettings?.limit ?? 24;
    const testimonials = await Testimonial.find({
      siteId: site.siteId,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    return NextResponse.json(
      {
        site: {
          siteId: site.siteId,
          name: site.name,
          publicSlug: site.publicSlug || site.siteId,
          theme: site.theme,
          wallSettings: site.wallSettings,
          testimonialDisplay: site.testimonialDisplay,
        },
        testimonials,
      },
      { headers }
    );
  } catch (error) {
    console.error('Public wall error:', error);
    return NextResponse.json({ error: 'Failed to load wall' }, { status: 500 });
  }
}
