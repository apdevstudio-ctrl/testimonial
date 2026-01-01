import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Credit from '@/lib/models/Credit';
import { authenticate } from '@/lib/middleware/auth';

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

export async function POST(req: NextRequest) {
  try {
    await authenticate(req);
    await connectDB();

    const body = await req.json();
    const { siteId, email, testimonialId, type, metadata } = body;

    if (!siteId || !email || !testimonialId || !type) {
      return NextResponse.json(
        { message: 'siteId, email, testimonialId, and type are required' },
        { status: 400 }
      );
    }

    const amount = type === 'video' ? 10 : 5;

    const credit = new Credit({
      siteId,
      email,
      testimonialId,
      type,
      amount,
      currency: 'points',
      redemptionCode: generateRedemptionCode(),
      metadata: metadata || {},
    });

    await credit.save();

    // Trigger webhook if configured
    if (metadata?.webhookUrl) {
      await triggerWebhook(metadata.webhookUrl, credit);
    }

    return NextResponse.json(credit, { status: 201 });
  } catch (error: any) {
    console.error('Issue credit error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to issue credit' },
      { status: error.message?.includes('Unauthorized') ? 401 : 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const siteId = searchParams.get('siteId');

    if (!email || !siteId) {
      return NextResponse.json(
        { message: 'email and siteId are required' },
        { status: 400 }
      );
    }

    const credits = await Credit.find({ email, siteId, isRedeemed: false });

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');

    return NextResponse.json(credits, { headers });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}

