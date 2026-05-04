import mongoose, { Schema, Document, Model } from 'mongoose';
import type { CurrentPlan, SubscriptionStatus } from '@/lib/subscription/constants';

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  role: string;
  emailVerified: boolean;
  avatar?: string;
  googleId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  /** App subscription (trial or paid); null when expired without a paid plan */
  currentPlan: CurrentPlan;
  planStartDate?: Date;
  planExpiryDate?: Date;
  isTrial: boolean;
  trialStartDate?: Date;
  trialExpiryDate?: Date;
  subscriptionStatus: SubscriptionStatus;
  successfulPaymentsCount: number;
  lemonSqueezyCustomerId?: string;
  lemonSqueezySubscriptionId?: string;
  /** Last known Lemon Squeezy subscription status string */
  lemonSqueezySubscriptionStatus?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
    currentPlan: {
      type: String,
      default: 'trial',
    },
    planStartDate: { type: Date },
    planExpiryDate: { type: Date },
    isTrial: { type: Boolean, default: true },
    trialStartDate: { type: Date },
    trialExpiryDate: { type: Date },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    successfulPaymentsCount: { type: Number, default: 0 },
    lemonSqueezyCustomerId: { type: String },
    lemonSqueezySubscriptionId: { type: String },
    lemonSqueezySubscriptionStatus: { type: String },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
