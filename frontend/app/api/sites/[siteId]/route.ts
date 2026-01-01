import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Site from '@/lib/models/Site';
import { authenticate } from '@/lib/middleware/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const user = await authenticate(req);
    await connectDB();

    const site = await Site.findOne({ siteId: params.siteId, userId: user._id.toString() });
    
    if (!site) {
      return NextResponse.json(
        { message: `Site with siteId ${params.siteId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(site);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch site' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const user = await authenticate(req);
    await connectDB();

    const site = await Site.findOne({ siteId: params.siteId, userId: user._id.toString() });
    
    if (!site) {
      return NextResponse.json(
        { message: `Site with siteId ${params.siteId} not found` },
        { status: 404 }
      );
    }

    const body = await req.json();
    Object.assign(site, body);
    await site.save();

    return NextResponse.json(site);
  } catch (error: any) {
    console.error('Update site error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update site' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const user = await authenticate(req);
    await connectDB();

    const site = await Site.findOne({ siteId: params.siteId, userId: user._id.toString() });
    
    if (!site) {
      return NextResponse.json(
        { message: `Site with siteId ${params.siteId} not found` },
        { status: 404 }
      );
    }

    await Site.deleteOne({ siteId: params.siteId, userId: user._id.toString() });
    return NextResponse.json({ message: 'Site deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to delete site' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

