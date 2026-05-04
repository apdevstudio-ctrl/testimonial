import { NextRequest, NextResponse } from 'next/server';
import {
  handleSubscriptionInvoice,
  handleSubscriptionPayload,
} from '@/lib/services/subscriptionWebhookHandlers';
import { verifyWebhookSignature } from '@/lib/services/lemonSqueezy';
import type { LemonSubscriptionAttributes } from '@/lib/services/lemonSqueezy';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature');
  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const metaEvent = (body.meta as Record<string, unknown>)?.event_name as string | undefined;
  const headerEvent = req.headers.get('x-event-name') || '';
  const eventName = (metaEvent && String(metaEvent).trim()) || headerEvent;

  const meta = (body.meta as { custom_data?: Record<string, unknown> }) || {};

  try {
    const data = body.data as { type?: string; id?: string; attributes?: Record<string, unknown> } | undefined;
    if (!data?.type || !data.id || !data.attributes) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (data.type === 'subscription-invoices') {
      const attrs = data.attributes as {
        store_id?: number;
        subscription_id: number;
        status: string;
        total: number;
        currency: string;
        user_email?: string;
        urls?: { invoice_url?: string | null };
      };
      if (
        eventName === 'subscription_payment_success' ||
        eventName === 'subscription_payment_recovered'
      ) {
        if (attrs.status === 'paid') {
          await handleSubscriptionInvoice(eventName, data.id, attrs, meta);
        }
      } else if (eventName === 'subscription_payment_failed') {
        // Auditing only; no user access change here
        // Optionally persist failed attempts via PaymentHistory with status failed
      }
    }

    if (data.type === 'subscriptions') {
      const attrs = data.attributes as LemonSubscriptionAttributes & { store_id?: number };
      if (
        [
          'subscription_created',
          'subscription_updated',
          'subscription_cancelled',
          'subscription_expired',
          'subscription_resumed',
          'subscription_paused',
          'subscription_unpaused',
        ].includes(eventName)
      ) {
        await handleSubscriptionPayload(eventName, data.id, attrs, meta);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    console.error('Lemon Squeezy webhook error:', e);
    return NextResponse.json({ message: 'Webhook handler error' }, { status: 500 });
  }
}
