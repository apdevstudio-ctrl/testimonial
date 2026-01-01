import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
  siteId: string;
  type: 'video' | 'text';
  videoUrl?: string;
  videoThumbnail?: string;
  text?: string;
  rating?: number;
  author: {
    name?: string;
    email?: string;
    company?: string;
    position?: string;
    avatar?: string;
  };
  isApproved: boolean;
  isPublished: boolean;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    sessionId?: string;
  };
  creditIssued?: boolean;
  creditId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    siteId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['video', 'text'],
    },
    videoUrl: String,
    videoThumbnail: String,
    text: String,
    rating: Number,
    author: {
      type: Object,
      default: {},
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Object,
      default: {},
    },
    creditIssued: Boolean,
    creditId: String,
  },
  {
    timestamps: true,
  }
);

const Testimonial: Model<ITestimonial> = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;

