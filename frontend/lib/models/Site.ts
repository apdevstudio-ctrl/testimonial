import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISite extends Document {
  userId: string;
  siteId: string;
  name: string;
  domain?: string;
  button: any;
  theme: any;
  enabledFeatures: {
    videoTestimonial: boolean;
    textTestimonial: boolean;
  };
  flowType: 'modal' | 'drawer' | 'page';
  formDesign?: any;
  testimonialDisplay?: any;
  pageDesign?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSchema = new Schema<ISite>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    siteId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
    },
    button: {
      type: Object,
      default: {},
    },
    theme: {
      type: Object,
      default: {},
    },
    enabledFeatures: {
      type: Object,
      default: {},
    },
    flowType: {
      type: String,
      default: 'modal',
      enum: ['modal', 'drawer', 'page'],
    },
    formDesign: {
      type: Object,
    },
    testimonialDisplay: {
      type: Object,
    },
    pageDesign: {
      type: Object,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Site: Model<ISite> = mongoose.models.Site || mongoose.model<ISite>('Site', SiteSchema);

export default Site;

