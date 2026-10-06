import User from '@/lib/models/User';
import { userCanHideBranding } from '@/lib/services/subscriptionAccess';

export async function shouldHideBranding(site: {
  userId?: string;
  wallSettings?: { hideBranding?: boolean };
  widgetCustomization?: { hideBranding?: boolean } | Record<string, unknown> | null;
}): Promise<boolean> {
  const widget = site.widgetCustomization as { hideBranding?: boolean } | undefined;
  const requested = Boolean(site.wallSettings?.hideBranding || widget?.hideBranding);
  if (!requested || !site.userId) return false;
  const user = await User.findById(site.userId);
  if (!user) return false;
  return userCanHideBranding(user);
}
