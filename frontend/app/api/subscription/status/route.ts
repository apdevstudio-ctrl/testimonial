import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { getSubscriptionGate, ensureSubscriptionDefaults, userCanHideBranding } from '@/lib/services/subscriptionAccess';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    ensureSubscriptionDefaults(user);
    const gate = getSubscriptionGate(user);
    return NextResponse.json({
      hasAccess: gate.hasAccess,
      reason: gate.reason,
      trialEndsAt: gate.trialEndsAt,
      planEndsAt: gate.planEndsAt,
      currentPlan: user.currentPlan,
      isTrial: user.isTrial,
      subscriptionStatus: user.subscriptionStatus,
      successfulPaymentsCount: user.successfulPaymentsCount ?? 0,
      trialStartDate: user.trialStartDate,
      trialExpiryDate: user.trialExpiryDate,
      planStartDate: user.planStartDate,
      planExpiryDate: user.planExpiryDate,
      lemonSqueezySubscriptionStatus: user.lemonSqueezySubscriptionStatus,
      canHideBranding: userCanHideBranding(user),
    });
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
