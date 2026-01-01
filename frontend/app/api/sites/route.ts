import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import connectDB from '@/lib/db/mongoose';
import Site from '@/lib/models/Site';
import { authenticate } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    await connectDB();

    const sites = await Site.find({ userId: user._id.toString() });
    return NextResponse.json(sites);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch sites' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    await connectDB();

    const body = await req.json();
    const { name, domain, ...otherFields } = body;

    if (!name) {
      return NextResponse.json(
        { message: 'Site name is required' },
        { status: 400 }
      );
    }

    // Generate UUID for siteId
    const siteId = randomUUID();

    // Check if siteId already exists for this user
    const existing = await Site.findOne({ siteId, userId: user._id.toString() });
    if (existing) {
      return NextResponse.json(
        { message: `Site with siteId ${siteId} already exists` },
        { status: 409 }
      );
    }

    const site = new Site({
      userId: user._id.toString(),
      siteId,
      name,
      domain,
      button: {
        enabled: true,
        type: 'floating',
        position: 'bottom-right',
        text: 'Give Testimonial',
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        shape: 'rounded',
        size: 'medium',
        visibility: {
          hideOnMobile: false,
          hideOnDesktop: false,
          hideAfterSubmission: false,
        },
        ...otherFields.button,
      },
      theme: {
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        fontFamily: 'inherit',
        borderRadius: '8px',
        buttonStyle: 'filled',
        ...otherFields.theme,
      },
      enabledFeatures: {
        videoTestimonial: true,
        textTestimonial: true,
        ...otherFields.enabledFeatures,
      },
      ...otherFields,
    });

    await site.save();
    return NextResponse.json(site, { status: 201 });
  } catch (error: any) {
    console.error('Create site error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create site' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

