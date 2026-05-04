import { NextResponse } from 'next/server';
import type { IUser } from '@/lib/models/User';
import {
  ensureSubscriptionDefaults,
  syncExpiredState,
  userHasFullAccess,
} from '@/lib/services/subscriptionAccess';

export async function requireActiveSubscription(user: IUser): Promise<NextResponse | null> {
  ensureSubscriptionDefaults(user);
  const now = new Date();
  if (syncExpiredState(user, now)) {
    await user.save();
  }
  if (userHasFullAccess(user, now)) {
    return null;
  }
  return NextResponse.json(
    {
      message:
        'Your trial or subscription is not active. Choose a plan to continue using the service.',
      code: 'SUBSCRIPTION_REQUIRED',
    },
    { status: 403 }
  );
}
