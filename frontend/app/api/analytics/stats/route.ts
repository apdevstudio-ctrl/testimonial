import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import AnalyticsEvent from '@/lib/models/AnalyticsEvent';
import { authenticate } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    await authenticate(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json(
        { message: 'siteId is required' },
        { status: 400 }
      );
    }

    const events = await AnalyticsEvent.find({ siteId });

    const stats = {
      totalEvents: events.length,
      buttonViews: events.filter((e) => e.eventType === 'button_view').length,
      buttonClicks: events.filter((e) => e.eventType === 'button_click').length,
      testimonialSubmissions: events.filter(
        (e) => e.eventType === 'testimonial_submitted'
      ).length,
      videoRecordings: events.filter(
        (e) => e.eventType === 'video_recording_started'
      ).length,
      textSubmissions: events.filter(
        (e) => e.eventType === 'text_submission_started'
      ).length,
      completionRate:
        events.filter((e) => e.eventType === 'testimonial_completed').length /
        Math.max(
          events.filter((e) => e.eventType === 'button_click').length,
          1
        ),
      eventsByType: {} as Record<string, number>,
      recentEvents: events.slice(-10).reverse(),
    };

    events.forEach((event) => {
      stats.eventsByType[event.eventType] =
        (stats.eventsByType[event.eventType] || 0) + 1;
    });

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch stats' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

