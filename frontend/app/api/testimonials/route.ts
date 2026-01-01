import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Testimonial from '@/lib/models/Testimonial';
import { uploadVideo } from '@/lib/services/cloudinary';
import { issueCredit } from '@/lib/services/credits';

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const siteId = formData.get('siteId') as string;
    const type = formData.get('type') as string;
    const text = formData.get('text') as string | null;
    const rating = formData.get('rating') as string | null;
    const video = formData.get('video') as File | null;

    if (!siteId || !type) {
      return NextResponse.json(
        { message: 'siteId and type are required' },
        { status: 400 }
      );
    }

    if (!['video', 'text'].includes(type)) {
      return NextResponse.json(
        { message: 'type must be either "video" or "text"' },
        { status: 400 }
      );
    }

    let videoUrl: string | undefined;
    let videoThumbnail: string | undefined;

    if (video && type === 'video') {
      const arrayBuffer = await video.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadVideo(buffer, video.name);
      videoUrl = uploadResult.url;
      videoThumbnail = uploadResult.thumbnail;
    }

    // Parse author and metadata from formData
    const authorName = formData.get('author[name]') as string | null;
    const authorEmail = formData.get('author[email]') as string | null;
    const authorCompany = formData.get('author[company]') as string | null;
    const authorPosition = formData.get('author[position]') as string | null;
    const sessionId = formData.get('metadata[sessionId]') as string | null;

    const testimonialData: any = {
      siteId,
      type,
      text: text || undefined,
      rating: rating ? (() => {
        const ratingNum = parseFloat(rating);
        return (!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5) ? ratingNum : undefined;
      })() : undefined,
      videoUrl,
      videoThumbnail,
      author: authorName || authorEmail ? {
        name: authorName || undefined,
        email: authorEmail || undefined,
        company: authorCompany || undefined,
        position: authorPosition || undefined,
      } : undefined,
      metadata: {
        userAgent: req.headers.get('user-agent') || undefined,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        referrer: req.headers.get('referer') || undefined,
        sessionId: sessionId || undefined,
      },
    };

    const testimonial = new Testimonial(testimonialData);
    await testimonial.save();

    // Issue credit for testimonial submission
    if (authorEmail) {
      try {
        await issueCredit({
          siteId,
          email: authorEmail,
          testimonialId: testimonial._id.toString(),
          type: type as 'video' | 'text',
        });
      } catch (creditError) {
        console.error('Failed to issue credit:', creditError);
        // Don't fail the testimonial creation if credit issuance fails
      }
    }

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');

    return NextResponse.json(testimonial, { status: 201, headers });
  } catch (error: any) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get('siteId');
    const all = searchParams.get('all');

    let testimonials;
    if (siteId) {
      if (all === 'true') {
        testimonials = await Testimonial.find({ siteId });
      } else {
        testimonials = await Testimonial.find({ siteId, isPublished: true });
      }
    } else {
      testimonials = await Testimonial.find();
    }

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET');

    return NextResponse.json(testimonials, { headers });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

