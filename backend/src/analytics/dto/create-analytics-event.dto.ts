import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateAnalyticsEventDto {
  @IsString()
  siteId: string;

  @IsEnum([
    'button_view',
    'button_click',
    'testimonial_type_selected',
    'video_recording_started',
    'video_recording_stopped',
    'screen_recording_started',
    'video_uploaded',
    'text_submission_started',
    'testimonial_submitted',
    'testimonial_completed',
    'testimonials_displayed',
  ])
  eventType:
    | 'button_view'
    | 'button_click'
    | 'testimonial_type_selected'
    | 'video_recording_started'
    | 'video_recording_stopped'
    | 'screen_recording_started'
    | 'video_uploaded'
    | 'text_submission_started'
    | 'testimonial_submitted'
    | 'testimonial_completed'
    | 'testimonials_displayed';

  @IsOptional()
  @IsObject()
  properties?: {
    testimonialType?: 'video' | 'text';
    sessionId?: string;
    testimonialId?: string;
    duration?: number;
    [key: string]: any;
  };

  @IsOptional()
  @IsObject()
  metadata?: {
    pageUrl?: string;
    sessionId?: string;
    [key: string]: any;
  };
}

