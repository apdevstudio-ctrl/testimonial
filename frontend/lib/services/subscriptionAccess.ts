import type { IUser } from '@/lib/models/User';
import { TRIAL_DAYS } from '@/lib/subscription/constants';
import type { CurrentPlan, PlanType } from '@/lib/subscription/constants';

/** Legacy DB value `quarterly` maps to 6-month billing */
export function normalizeBillingPlan(plan: string | null | undefined): CurrentPlan | null {
  if (plan === 'quarterly') return 'six_month';
  if (plan === 'trial' || plan === 'monthly' || plan === 'six_month' || plan === 'yearly') return plan;
  return null;
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}

/**
 * Backfill subscription fields for users created before billing existed.
 */
export function ensureSubscriptionDefaults(user: IUser): boolean {
  let changed = false;
  const created = user.createdAt || new Date();

  if (!user.trialStartDate) {
    user.trialStartDate = created;
    changed = true;
  }
  if (!user.trialExpiryDate) {
    user.trialExpiryDate = addDays(user.trialStartDate, TRIAL_DAYS);
    changed = true;
  }
  if (user.isTrial === undefined || user.isTrial === null) {
    user.isTrial = true;
    changed = true;
  }
  if (!user.currentPlan) {
    user.currentPlan = 'trial';
    changed = true;
  }
  if (!user.subscriptionStatus) {
    user.subscriptionStatus = 'active';
    changed = true;
  }
  if (user.successfulPaymentsCount === undefined || user.successfulPaymentsCount === null) {
    user.successfulPaymentsCount = 0;
    changed = true;
  }
  return changed;
}

export function applyTrialForNewUser(user: IUser): void {
  const start = new Date();
  user.trialStartDate = start;
  user.trialExpiryDate = addDays(start, TRIAL_DAYS);
  user.isTrial = true;
  user.currentPlan = 'trial';
  user.subscriptionStatus = 'active';
  user.planStartDate = undefined;
  user.planExpiryDate = undefined;
  user.successfulPaymentsCount = user.successfulPaymentsCount ?? 0;
}

function envVariant(...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = process.env[key]?.trim();
    if (v) return v;
  }
  return undefined;
}

export function variantIdToPlan(variantId: string | number | undefined): PlanType | null {
  if (variantId === undefined || variantId === null) return null;
  const v = String(variantId);
  const m = envVariant('LEMONSQUEEZY_VARIANT_MONTHLY');
  const s = envVariant('LEMONSQUEEZY_VARIANT_SIX_MONTH', 'LEMONSQUEEZY_VARIANT_QUARTERLY');
  const y = envVariant('LEMONSQUEEZY_VARIANT_YEARLY');
  if (m && v === m) return 'monthly';
  if (s && v === s) return 'six_month';
  if (y && v === y) return 'yearly';
  return null;
}

export function planToVariantId(plan: 'monthly' | 'six_month' | 'yearly'): string | undefined {
  if (plan === 'monthly') return envVariant('LEMONSQUEEZY_VARIANT_MONTHLY');
  if (plan === 'six_month') return envVariant('LEMONSQUEEZY_VARIANT_SIX_MONTH', 'LEMONSQUEEZY_VARIANT_QUARTERLY');
  if (plan === 'yearly') return envVariant('LEMONSQUEEZY_VARIANT_YEARLY');
  return undefined;
}

/** Env keys to set for each plan (for error messages). */
export function planVariantEnvHint(plan: 'monthly' | 'six_month' | 'yearly'): string {
  if (plan === 'monthly') return 'LEMONSQUEEZY_VARIANT_MONTHLY';
  if (plan === 'six_month')
    return 'LEMONSQUEEZY_VARIANT_SIX_MONTH (or legacy LEMONSQUEEZY_VARIANT_QUARTERLY)';
  return 'LEMONSQUEEZY_VARIANT_YEARLY';
}

/** Lemon Squeezy statuses that still allow product access */
function lemonStatusAllowsAccess(status: string | undefined): boolean {
  if (!status) return true;
  const denied = new Set(['expired', 'unpaid', 'paused']);
  return !denied.has(status);
}

function trialIsActive(user: IUser, now: Date): boolean {
  if (!user.isTrial || !user.trialExpiryDate) return false;
  return now <= new Date(user.trialExpiryDate);
}

function paidPlanIsActive(user: IUser, now: Date): boolean {
  const paid: CurrentPlan[] = ['monthly', 'six_month', 'yearly'];
  const plan = normalizeBillingPlan(user.currentPlan as string);
  if (!plan || !paid.includes(plan)) return false;
  if (!user.planExpiryDate) return false;
  if (now > new Date(user.planExpiryDate)) return false;
  if (!lemonStatusAllowsAccess(user.lemonSqueezySubscriptionStatus)) return false;
  if (user.subscriptionStatus === 'expired') return false;
  return true;
}

export function userHasFullAccess(user: IUser, now: Date = new Date()): boolean {
  if (user.role === 'admin') return true;
  ensureSubscriptionDefaults(user);
  syncExpiredState(user, now);
  if (trialIsActive(user, now)) return true;
  if (paidPlanIsActive(user, now)) return true;
  return false;
}

/** Update in-memory user when trial/paid period lapsed (caller may persist) */
export function syncExpiredState(user: IUser, now: Date = new Date()): boolean {
  let changed = false;
  const paid: CurrentPlan[] = ['monthly', 'six_month', 'yearly'];
  const onTrial = trialIsActive(user, now);
  const normalizedPlan = normalizeBillingPlan(user.currentPlan as string);
  if (!onTrial && user.isTrial && user.subscriptionStatus === 'active' && !(normalizedPlan && paid.includes(normalizedPlan))) {
    user.isTrial = false;
    user.subscriptionStatus = 'expired';
    user.currentPlan = null as unknown as CurrentPlan;
    changed = true;
  }
  if (
    normalizedPlan &&
    paid.includes(normalizedPlan) &&
    user.planExpiryDate &&
    now > new Date(user.planExpiryDate) &&
    user.lemonSqueezySubscriptionStatus !== 'cancelled'
  ) {
    if (user.subscriptionStatus !== 'expired') {
      user.subscriptionStatus = 'expired';
      changed = true;
    }
  }
  return changed;
}

export type SubscriptionGateReason =
  | 'ok'
  | 'trial_expired'
  | 'subscription_expired'
  | 'subscription_inactive';

export function getSubscriptionGate(user: IUser, now: Date = new Date()): {
  hasAccess: boolean;
  reason: SubscriptionGateReason;
  trialEndsAt?: string;
  planEndsAt?: string;
} {
  if (user.role === 'admin') {
    return { hasAccess: true, reason: 'ok' };
  }
  ensureSubscriptionDefaults(user);
  syncExpiredState(user, now);

  const trialEnd = user.trialExpiryDate ? new Date(user.trialExpiryDate).toISOString() : undefined;
  const planEnd = user.planExpiryDate ? new Date(user.planExpiryDate).toISOString() : undefined;

  if (trialIsActive(user, now)) {
    return { hasAccess: true, reason: 'ok', trialEndsAt: trialEnd, planEndsAt: planEnd };
  }
  if (paidPlanIsActive(user, now)) {
    return { hasAccess: true, reason: 'ok', trialEndsAt: trialEnd, planEndsAt: planEnd };
  }

  if (user.isTrial && user.trialExpiryDate && now > new Date(user.trialExpiryDate)) {
    return { hasAccess: false, reason: 'trial_expired', trialEndsAt: trialEnd, planEndsAt: planEnd };
  }
  if (user.subscriptionStatus === 'cancelled' && user.planExpiryDate && now > new Date(user.planExpiryDate)) {
    return { hasAccess: false, reason: 'subscription_expired', trialEndsAt: trialEnd, planEndsAt: planEnd };
  }
  if (user.subscriptionStatus === 'expired' || !userHasFullAccess(user, now)) {
    return { hasAccess: false, reason: 'subscription_expired', trialEndsAt: trialEnd, planEndsAt: planEnd };
  }
  return { hasAccess: false, reason: 'subscription_inactive', trialEndsAt: trialEnd, planEndsAt: planEnd };
}
