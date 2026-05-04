import crypto from 'node:crypto';

const LS_API = 'https://api.lemonsqueezy.com/v1';

function apiKey(): string {
  const k = process.env.LEMONSQUEEZY_API_KEY;
  if (!k) throw new Error('LEMONSQUEEZY_API_KEY is not configured');
  return k;
}

function storeId(): string {
  const s = process.env.LEMONSQUEEZY_STORE_ID;
  if (!s) throw new Error('LEMONSQUEEZY_STORE_ID is not configured');
  return s;
}

function appBaseUrl(): string | undefined {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }
  return undefined;
}

type CheckoutResponse = {
  data: {
    id: string;
    attributes: {
      url: string;
    };
  };
};

export async function createCheckout(params: {
  variantId: string;
  userId: string;
  email: string;
  redirectUrl?: string;
}): Promise<string> {
  const { variantId, userId, email, redirectUrl } = params;
  const base = appBaseUrl();
  const afterPay = redirectUrl || (base ? `${base}/dashboard?sub=success` : undefined);

  const body = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          email,
          custom: {
            user_id: userId,
          },
        },
        product_options: {
          ...(afterPay ? { redirect_url: afterPay } : {}),
        },
      },
      relationships: {
        store: {
          data: { type: 'stores', id: storeId() },
        },
        variant: {
          data: { type: 'variants', id: variantId },
        },
      },
    },
  };

  const res = await fetch(`${LS_API}/checkouts`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey()}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Lemon Squeezy checkout HTTP error:', res.status, text.slice(0, 500));
    throw new Error('Lemon Squeezy checkout request failed');
  }

  const json = (await res.json()) as CheckoutResponse;
  return json.data.attributes.url;
}

export type LemonSubscriptionAttributes = {
  store_id?: number;
  customer_id: number;
  order_id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  user_name: string;
  user_email: string;
  status: string;
  renews_at: string | null;
  ends_at: string | null;
  cancelled: boolean;
};

export async function fetchSubscription(
  subscriptionId: string
): Promise<{ id: string; attributes: LemonSubscriptionAttributes } | null> {
  const res = await fetch(`${LS_API}/subscriptions/${subscriptionId}`, {
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey()}`,
    },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    data: { id: string; attributes: LemonSubscriptionAttributes };
  };
  return json.data;
}

export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(signatureHeader, 'utf8');
  if (digest.length !== signature.length) return false;
  return crypto.timingSafeEqual(digest, signature);
}
