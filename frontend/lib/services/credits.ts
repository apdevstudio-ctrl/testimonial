import connectDB from '@/lib/db/mongoose';
import Credit from '@/lib/models/Credit';

function generateRedemptionCode(): string {
  return `CREDIT-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
}

async function triggerWebhook(webhookUrl: string, credit: any): Promise<void> {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'credit_issued',
        credit: {
          id: credit._id.toString(),
          siteId: credit.siteId,
          email: credit.email,
          testimonialId: credit.testimonialId,
          amount: credit.amount,
          currency: credit.currency,
          redemptionCode: credit.redemptionCode,
        },
      }),
    });
  } catch (error) {
    console.error('Webhook trigger failed:', error);
  }
}

export async function issueCredit(data: {
  siteId: string;
  email: string;
  testimonialId: string;
  type: 'video' | 'text';
  metadata?: any;
}): Promise<any> {
  await connectDB();

  const amount = data.type === 'video' ? 10 : 5;

  const credit = new Credit({
    siteId: data.siteId,
    email: data.email,
    testimonialId: data.testimonialId,
    type: data.type,
    amount,
    currency: 'points',
    redemptionCode: generateRedemptionCode(),
    metadata: data.metadata || {},
  });

  await credit.save();

  // Trigger webhook if configured
  if (data.metadata?.webhookUrl) {
    await triggerWebhook(data.metadata.webhookUrl, credit);
  }

  return credit;
}

