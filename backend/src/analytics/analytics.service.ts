import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AnalyticsEvent,
  AnalyticsEventDocument,
} from './schemas/analytics-event.schema';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(AnalyticsEvent.name)
    private analyticsEventModel: Model<AnalyticsEventDocument>,
  ) {}

  async trackEvent(
    createEventDto: CreateAnalyticsEventDto,
    req: any,
  ): Promise<AnalyticsEvent> {
    const event = new this.analyticsEventModel({
      ...createEventDto,
      metadata: {
        userAgent: req?.headers['user-agent'],
        ipAddress: req?.ip || req?.connection?.remoteAddress,
        referrer: req?.headers['referer'],
        pageUrl: createEventDto.metadata?.pageUrl,
        sessionId: createEventDto.metadata?.sessionId,
        ...createEventDto.metadata,
      },
    });
    return event.save();
  }

  async getStats(siteId: string) {
    const events = await this.analyticsEventModel.find({ siteId }).exec();

    const stats = {
      totalEvents: events.length,
      buttonViews: events.filter((e) => e.eventType === 'button_view').length,
      buttonClicks: events.filter((e) => e.eventType === 'button_click').length,
      testimonialSubmissions: events.filter(
        (e) => e.eventType === 'testimonial_submitted',
      ).length,
      videoRecordings: events.filter(
        (e) => e.eventType === 'video_recording_started',
      ).length,
      textSubmissions: events.filter(
        (e) => e.eventType === 'text_submission_started',
      ).length,
      completionRate:
        events.filter((e) => e.eventType === 'testimonial_completed').length /
        Math.max(
          events.filter((e) => e.eventType === 'button_click').length,
          1,
        ),
      eventsByType: {},
      recentEvents: events.slice(-10).reverse(),
    };

    // Group events by type
    events.forEach((event) => {
      stats.eventsByType[event.eventType] =
        (stats.eventsByType[event.eventType] || 0) + 1;
    });

    return stats;
  }
}

