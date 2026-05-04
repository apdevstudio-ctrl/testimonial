export const TRIAL_DAYS = 30;

export type CurrentPlan = 'trial' | 'monthly' | 'six_month' | 'yearly' | null;

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

export type PaymentStatus = 'success' | 'failed' | 'pending';

export type PlanType = 'trial' | 'monthly' | 'six_month' | 'yearly';

/** Marketing display amounts (actual charge is your Lemon Squeezy variant price) */
export const SIX_MONTH_DISPLAY_USD = 28;
export const YEARLY_DISPLAY_USD = 100;
