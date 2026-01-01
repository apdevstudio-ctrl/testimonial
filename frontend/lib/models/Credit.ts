import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICredit extends Document {
  siteId: string;
  email: string;
  testimonialId: string;
  type: 'video' | 'text';
  amount: number;
  currency: string;
  isRedeemed: boolean;
  redeemedAt?: Date;
  redemptionCode?: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

const CreditSchema = new Schema<ICredit>(
  {
    siteId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    testimonialId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['video', 'text'],
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'points',
    },
    isRedeemed: {
      type: Boolean,
      default: false,
    },
    redeemedAt: Date,
    redemptionCode: String,
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Credit: Model<ICredit> = mongoose.models.Credit || mongoose.model<ICredit>('Credit', CreditSchema);

export default Credit;

