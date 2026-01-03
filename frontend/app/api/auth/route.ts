import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { signToken } from '@/lib/services/jwt';
import { authenticate } from '@/lib/middleware/auth';

// Force dynamic rendering to prevent static optimization
export const dynamic = 'force-dynamic';

// GET /api/auth - Get current user (requires authentication)
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

// POST /api/auth?action=login - Login user
// POST /api/auth?action=register - Register user
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'login'; // Default to login for backward compatibility

    await connectDB();

    const body = await req.json();

    if (action === 'login') {
      return await handleLogin(body);
    } else if (action === 'register') {
      return await handleRegister(body);
    } else {
      return NextResponse.json(
        { message: `Invalid action: ${action}. Supported actions: login, register` },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { message: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}

async function handleLogin(body: any) {
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  }

  // Check if user has password (OAuth users might not have password)
  if (!user.password) {
    return NextResponse.json(
      { message: 'Please sign in with Google' },
      { status: 401 }
    );
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  }

  // Check if user is active
  if (user.isActive === false) {
    return NextResponse.json(
      { message: 'Account is deactivated' },
      { status: 401 }
    );
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT token
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const access_token = signToken(payload);

  // Remove password from response
  const userObject = user.toObject();
  delete userObject.password;

  return NextResponse.json({
    access_token,
    user: userObject,
  });
}

async function handleRegister(body: any) {
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: 'Name, email, and password are required' },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: 'User with this email already exists' },
      { status: 409 }
    );
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = new User({
    email,
    name,
    password: hashedPassword,
    emailVerified: false,
  });

  await user.save();

  // Generate JWT token
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const access_token = signToken(payload);

  // Remove password from response
  const userObject = user.toObject();
  delete userObject.password;

  return NextResponse.json({
    access_token,
    user: userObject,
  });
}

