import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { signToken } from '@/lib/services/jwt';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST /api/auth/google - Handle Google OAuth callback
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { idToken, accessToken } = body;

    if (!idToken && !accessToken) {
      return NextResponse.json(
        { message: 'Google token is required' },
        { status: 400 }
      );
    }

    // Verify Google token and get user info
    let googleUser;
    
    if (idToken) {
      // Verify ID token with Google
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (!response.ok) {
        throw new Error('Invalid Google token');
      }
      googleUser = await response.json();
    } else if (accessToken) {
      // Get user info using access token
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Google user info');
      }
      googleUser = await response.json();
    }

    if (!googleUser || !googleUser.email) {
      return NextResponse.json(
        { message: 'Failed to get Google user information' },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await User.findOne({ 
      $or: [
        { email: googleUser.email },
        { googleId: googleUser.sub || googleUser.id }
      ]
    });

    if (user) {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = googleUser.sub || googleUser.id;
      }
      if (!user.avatar && googleUser.picture) {
        user.avatar = googleUser.picture;
      }
      if (!user.emailVerified) {
        user.emailVerified = true;
      }
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = new User({
        email: googleUser.email,
        name: googleUser.name || googleUser.email.split('@')[0],
        googleId: googleUser.sub || googleUser.id,
        avatar: googleUser.picture,
        emailVerified: true,
        isActive: true,
        lastLogin: new Date(),
      });
      await user.save();
    }

    // Check if user is active
    if (user.isActive === false) {
      return NextResponse.json(
        { message: 'Account is deactivated' },
        { status: 401 }
      );
    }

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
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { message: error.message || 'Google authentication failed' },
      { status: 500 }
    );
  }
}

