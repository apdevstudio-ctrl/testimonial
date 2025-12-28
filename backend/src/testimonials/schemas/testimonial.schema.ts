import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

@Schema({ timestamps: true })
export class Testimonial {
  @Prop({ required: true, index: true })
  siteId: string;

  @Prop({ required: true })
  type: 'video' | 'text';

  @Prop()
  videoUrl?: string;

  @Prop()
  videoThumbnail?: string;

  @Prop()
  text?: string;

  @Prop()
  rating?: number;

  @Prop({ type: Object })
  author: {
    name?: string;
    email?: string;
    company?: string;
    position?: string;
    avatar?: string;
  };

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ type: Object })
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    sessionId?: string;
  };

  @Prop()
  creditIssued?: boolean;

  @Prop()
  creditId?: string;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);

