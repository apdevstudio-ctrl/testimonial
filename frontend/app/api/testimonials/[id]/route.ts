import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Testimonial from '@/lib/models/Testimonial';
import { authenticate } from '@/lib/middleware/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const testimonial = await Testimonial.findById(params.id);
    
    if (!testimonial) {
      return NextResponse.json(
        { message: `Testimonial with ID ${params.id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await authenticate(req);
    await connectDB();

    const body = await req.json();
    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!testimonial) {
      return NextResponse.json(
        { message: `Testimonial with ID ${params.id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update testimonial' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

