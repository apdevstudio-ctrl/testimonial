import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { signToken } from '@/lib/services/jwt';

// Explicitly set runtime for Vercel
export const runtime = 'nodejs';

// Register route handler
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
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
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}

