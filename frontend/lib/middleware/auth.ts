import { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from '../services/jwt';
import User, { IUser } from '../models/User';
import connectDB from '../db/mongoose';

export interface AuthRequest extends NextRequest {
  user?: IUser;
}

export async function authenticate(req: NextRequest): Promise<IUser> {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  
  try {
    const payload = verifyToken(token);
    await connectDB();
    
    const user = await User.findById(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

