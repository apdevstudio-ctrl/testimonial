import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';
import connectDB from '@/lib/db/mongoose';
import PaymentHistory from '@/lib/models/PaymentHistory';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 200);

    const [items, successCountAgg] = await Promise.all([
      PaymentHistory.find({ userId: user._id })
        .sort({ paymentDate: -1 })
        .limit(limit)
        .lean(),
      PaymentHistory.countDocuments({ userId: user._id, paymentStatus: 'success' }),
    ]);

    return NextResponse.json({
      totalSuccessfulPayments: successCountAgg,
      payments: items.map((p) => ({
        id: p._id,
        planType: p.planType,
        amountPaid: p.amountPaid,
        currency: p.currency,
        paymentDate: p.paymentDate,
        paymentStatus: p.paymentStatus,
        transactionId: p.transactionId,
        invoiceUrl: p.invoiceUrl,
        lemonSqueezyOrderId: p.lemonSqueezyOrderId,
        lemonSqueezySubscriptionId: p.lemonSqueezySubscriptionId,
      })),
    });
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
