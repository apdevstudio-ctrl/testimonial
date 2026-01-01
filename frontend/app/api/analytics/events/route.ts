import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import AnalyticsEvent from '@/lib/models/AnalyticsEvent';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { siteId, eventType, properties, metadata } = body;

    if (!siteId || !eventType) {
      return NextResponse.json(
        { message: 'siteId and eventType are required' },
        { status: 400 }
      );
    }

    const event = new AnalyticsEvent({
      siteId,
      eventType,
      properties: properties || {},
      metadata: {
        userAgent: req.headers.get('user-agent') || undefined,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        referrer: req.headers.get('referer') || undefined,
        pageUrl: metadata?.pageUrl || undefined,
        sessionId: metadata?.sessionId || undefined,
        ...metadata,
      },
    });

    await event.save();

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST');

    return NextResponse.json(event, { status: 201, headers });
  } catch (error: any) {
    console.error('Track event error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to track event' },
      { status: 500 }
    );
  }
}

