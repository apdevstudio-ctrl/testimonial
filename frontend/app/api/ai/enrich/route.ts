import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { enrichTestimonial } from '@/lib/ai/process';
import connectDB from '@/lib/db/mongoose';
import Testimonial from '@/lib/models/Testimonial';

export async function POST(req: NextRequest) {
  try {
    await authenticate(req);
    await connectDB();
    const { testimonialId } = await req.json();
    if (!testimonialId) {
      return NextResponse.json({ message: 'testimonialId required' }, { status: 400 });
    }

    const t = await Testimonial.findById(testimonialId);
    if (!t) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const text = t.text || '';
    const enrichment = await enrichTestimonial(text);

    t.ai = { ...enrichment, processedAt: new Date() };
    await t.save();

    return NextResponse.json({ testimonial: t, enrichment });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'AI enrich failed';
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
