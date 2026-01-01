import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: false })
  password?: string; // Optional for OAuth users

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar?: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  googleId?: string; // For Google OAuth

  @Prop({ default: 'user' })
  role: 'user' | 'admin';

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLogin?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

