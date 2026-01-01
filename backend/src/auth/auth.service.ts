import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user
    const user = new this.userModel({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      emailVerified: false,
    });

    await user.save();

    // Generate JWT token
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    return {
      access_token,
      user: userObject,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has password (OAuth users might not have password)
    if (!user.password) {
      throw new UnauthorizedException('Please sign in with Google');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    return {
      access_token,
      user: userObject,
    };
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user || !user.isActive) {
      return null;
    }
    return user;
  }

  async findOrCreateGoogleUser(googleProfile: any) {
    let user = await this.userModel.findOne({ googleId: googleProfile.id });
    
    if (!user) {
      // Check if user exists with same email
      user = await this.userModel.findOne({ email: googleProfile.email });
      if (user) {
        // Link Google account to existing user
        user.googleId = googleProfile.id;
        user.avatar = googleProfile.picture;
        await user.save();
      } else {
        // Create new user
        user = new this.userModel({
          email: googleProfile.email,
          name: googleProfile.name,
          googleId: googleProfile.id,
          avatar: googleProfile.picture,
          emailVerified: googleProfile.verified_email || false,
        });
        await user.save();
      }
    } else {
      // Update user info
      user.name = googleProfile.name;
      user.avatar = googleProfile.picture;
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    return {
      access_token,
      user: userObject,
    };
  }
}

