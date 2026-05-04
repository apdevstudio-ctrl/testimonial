import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongoose';
import User, { IUser } from '@/lib/models/User';
import PaymentHistory from '@/lib/models/PaymentHistory';
import {
  ensureSubscriptionDefaults,
  normalizeBillingPlan,
  variantIdToPlan,
} from '@/lib/services/subscriptionAccess';
import { fetchSubscription } from '@/lib/services/lemonSqueezy';
import type { PlanType } from '@/lib/subscription/constants';
import type { LemonSubscriptionAttributes } from '@/lib/services/lemonSqueezy';

function expectedStoreId(): string | undefined {
  return process.env.LEMONSQUEEZY_STORE_ID?.trim();
}

/** Reject webhooks for other stores (misconfiguration or replay across stores). */
export function webhookStoreMatches(storeId: number | string | undefined): boolean {
  const expected = expectedStoreId();
  if (!expected || storeId === undefined || storeId === null) return false;
  return String(storeId) === String(expected);
}

function planExpiryFromSubscription(a: LemonSubscriptionAttributes): Date | undefined {
  const status = a.status;
  if (status === 'cancelled' || status === 'expired') {
    if (a.ends_at) return new Date(a.ends_at);
  }
  if (a.renews_at) return new Date(a.renews_at);
  if (a.ends_at) return new Date(a.ends_at);
  return undefined;
}

function mapSubscriptionToOurStatus(a: LemonSubscriptionAttributes): 'active' | 'expired' | 'cancelled' {
  if (a.status === 'expired' || a.status === 'unpaid') return 'expired';
  if (a.status === 'cancelled') return 'cancelled';
  return 'active';
}

function normalizeEmail(email: string | undefined): string | null {
  if (!email || typeof email !== 'string') return null;
  return email.toLowerCase().trim();
}

/**
 * Resolve app user for a Lemon subscription / invoice.
 * - Prefer existing DB link (lemonSqueezySubscriptionId) so renewals never follow stale custom_data.
 * - custom_data.user_id is only accepted if it matches the authenticated customer email on the LS payload
 *   (prevents confused-deputy linking when email alone would be ambiguous).
 */
export async function findUserForLemonSubscription(
  subscriptionId: string,
  customUserId: string | undefined,
  lemonCustomerEmail: string | undefined
): Promise<IUser | null> {
  await connectDB();

  const bySub = await User.findOne({ lemonSqueezySubscriptionId: String(subscriptionId) });
  if (bySub) return bySub;

  const lsEmail = normalizeEmail(lemonCustomerEmail);
  if (!customUserId || !mongoose.isValidObjectId(customUserId) || !lsEmail) {
    return null;
  }

  const u = await User.findById(customUserId);
  if (!u) return null;
  if (normalizeEmail(u.email) !== lsEmail) return null;
  return u;
}

export async function applySubscriptionToUser(
  user: IUser,
  a: LemonSubscriptionAttributes,
  subscriptionId: string
): Promise<void> {
  ensureSubscriptionDefaults(user);
  const plan = variantIdToPlan(a.variant_id);
  if (plan) {
    user.currentPlan = plan;
  }
  user.isTrial = false;
  user.lemonSqueezySubscriptionId = String(subscriptionId);
  user.lemonSqueezyCustomerId = String(a.customer_id);
  user.lemonSqueezySubscriptionStatus = a.status;
  if (!user.planStartDate || user.isTrial) {
    user.planStartDate = new Date();
  }
  const exp = planExpiryFromSubscription(a);
  if (exp) user.planExpiryDate = exp;
  user.subscriptionStatus = mapSubscriptionToOurStatus(a);
}

async function recordPaymentIfNew(params: {
  userId: mongoose.Types.ObjectId;
  planType: PlanType;
  amountCents: number;
  currency: string;
  transactionId: string;
  invoiceUrl?: string;
  orderId?: string;
  subscriptionId?: string;
  variantId?: string;
  eventName: string;
  status: 'success' | 'failed' | 'pending';
}): Promise<void> {
  const existing = await PaymentHistory.findOne({ transactionId: params.transactionId });
  if (existing) return;

  await PaymentHistory.create({
    userId: params.userId,
    planType: params.planType,
    amountPaid: params.amountCents / 100,
    currency: params.currency || 'USD',
    paymentDate: new Date(),
    paymentStatus: params.status,
    transactionId: params.transactionId,
    invoiceUrl: params.invoiceUrl,
    lemonSqueezyOrderId: params.orderId,
    lemonSqueezySubscriptionId: params.subscriptionId,
    variantId: params.variantId,
    rawEventName: params.eventName,
  });

  if (params.status === 'success') {
    await User.updateOne({ _id: params.userId }, { $inc: { successfulPaymentsCount: 1 } });
  }
}

export async function handleSubscriptionInvoice(
  eventName: string,
  invoiceId: string,
  attrs: {
    store_id?: number;
    subscription_id: number;
    status: string;
    total: number;
    currency: string;
    user_email?: string;
    urls?: { invoice_url?: string | null };
  },
  meta: { custom_data?: Record<string, unknown> }
): Promise<void> {
  await connectDB();
  if (!webhookStoreMatches(attrs.store_id)) {
    console.warn('Ignored subscription invoice webhook: store_id mismatch');
    return;
  }
  if (attrs.status !== 'paid') return;
  const subId = String(attrs.subscription_id);
  const rawUid = meta.custom_data?.user_id ?? meta.custom_data?.userId;
  const customUserId = typeof rawUid === 'string' ? rawUid : undefined;
  const user = await findUserForLemonSubscription(subId, customUserId, attrs.user_email);
  if (!user) return;

  const sub = await fetchSubscription(subId);
  const variantId = sub?.attributes?.variant_id;
  const mapped = variantIdToPlan(variantId);
  const fromUser = normalizeBillingPlan(user.currentPlan as string);
  const planType: PlanType =
    mapped ||
    (fromUser === 'monthly' || fromUser === 'six_month' || fromUser === 'yearly' ? fromUser : null) ||
    'monthly';

  await recordPaymentIfNew({
    userId: user._id,
    planType,
    amountCents: attrs.total,
    currency: attrs.currency,
    transactionId: `ls_subinv_${invoiceId}`,
    invoiceUrl: attrs.urls?.invoice_url || undefined,
    subscriptionId: subId,
    variantId: variantId != null ? String(variantId) : undefined,
    eventName,
    status: 'success',
  });
}

export async function handleSubscriptionPayload(
  eventName: string,
  subscriptionId: string,
  attrs: LemonSubscriptionAttributes & { store_id?: number },
  meta: { custom_data?: Record<string, unknown> }
): Promise<void> {
  await connectDB();
  if (!webhookStoreMatches(attrs.store_id)) {
    console.warn('Ignored subscription webhook: store_id mismatch');
    return;
  }

  const rawUid = meta.custom_data?.user_id ?? meta.custom_data?.userId;
  const customUserId = typeof rawUid === 'string' ? rawUid : undefined;
  const user = await findUserForLemonSubscription(subscriptionId, customUserId, attrs.user_email);
  if (!user) return;

  await applySubscriptionToUser(user, attrs, subscriptionId);
  await user.save();
}
