import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsEventDocument = AnalyticsEvent & Document;

@Schema({ timestamps: true })
export class AnalyticsEvent {
  @Prop({ required: true, index: true })
  siteId: string;

  @Prop({ required: true, index: true })
  eventType:
    | 'button_view'
    | 'button_click'
    | 'testimonial_type_selected'
    | 'video_recording_started'
    | 'video_recording_stopped'
    | 'video_uploaded'
    | 'text_submission_started'
    | 'testimonial_submitted'
    | 'testimonial_completed';

  @Prop({ type: Object })
  properties: {
    testimonialType?: 'video' | 'text';
    sessionId?: string;
    testimonialId?: string;
    duration?: number;
    [key: string]: any;
  };

  @Prop({ type: Object })
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    pageUrl?: string;
    sessionId?: string;
  };
}

export const AnalyticsEventSchema =
  SchemaFactory.createForClass(AnalyticsEvent);

