import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware/auth';

// Explicitly set runtime for Vercel
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    return NextResponse.json(userObject);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Unauthorized' },
      { status: 401 }
    );
  }
}

