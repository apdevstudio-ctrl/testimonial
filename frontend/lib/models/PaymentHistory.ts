import mongoose, { Schema, Document, Model } from 'mongoose';
import type { PaymentStatus, PlanType } from '@/lib/subscription/constants';

export interface IPaymentHistory extends Document {
  userId: mongoose.Types.ObjectId;
  planType: PlanType;
  amountPaid: number;
  currency: string;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
  transactionId: string;
  invoiceUrl?: string;
  lemonSqueezyOrderId?: string;
  lemonSqueezySubscriptionId?: string;
  variantId?: string;
  rawEventName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentHistorySchema = new Schema<IPaymentHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planType: {
      type: String,
      required: true,
      enum: ['trial', 'monthly', 'quarterly', 'six_month', 'yearly'],
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['success', 'failed', 'pending'],
      index: true,
    },
    transactionId: {
      type: String,
      required: true,
      index: true,
    },
    invoiceUrl: {
      type: String,
    },
    lemonSqueezyOrderId: {
      type: String,
    },
    lemonSqueezySubscriptionId: {
      type: String,
    },
    variantId: {
      type: String,
    },
    rawEventName: {
      type: String,
    },
  },
  { timestamps: true }
);

PaymentHistorySchema.index({ userId: 1, paymentDate: -1 });

const PaymentHistory: Model<IPaymentHistory> =
  mongoose.models.PaymentHistory ||
  mongoose.model<IPaymentHistory>('PaymentHistory', PaymentHistorySchema);

export default PaymentHistory;
