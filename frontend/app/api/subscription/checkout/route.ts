import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import { createCheckout } from '@/lib/services/lemonSqueezy';
import { planToVariantId, planVariantEnvHint } from '@/lib/services/subscriptionAccess';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await authenticate(req);
    const body = await req.json();
    const plan = body.plan as 'monthly' | 'six_month' | 'yearly';
    if (!['monthly', 'six_month', 'yearly'].includes(plan)) {
      return NextResponse.json({ message: 'Invalid plan' }, { status: 400 });
    }
    const variantId = planToVariantId(plan);
    if (!variantId) {
      const hint = planVariantEnvHint(plan);
      return NextResponse.json(
        {
          message: `Add ${hint} to frontend/.env.local with your Lemon Squeezy variant ID, then restart the dev server. Copy .env.example if needed; you also need LEMONSQUEEZY_API_KEY and LEMONSQUEEZY_STORE_ID.`,
          plan,
          configureEnv: hint,
        },
        { status: 503 }
      );
    }
    const url = await createCheckout({
      variantId,
      userId: user._id.toString(),
      email: user.email,
    });
    return NextResponse.json({ checkoutUrl: url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Checkout failed';
    if (msg.includes('No token') || msg.includes('Invalid or expired')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Checkout error:', e);
    return NextResponse.json(
      { message: 'Unable to create checkout. Please try again or contact support.' },
      { status: 502 }
    );
  }
}
