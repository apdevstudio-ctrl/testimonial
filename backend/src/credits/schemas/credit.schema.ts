import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CreditDocument = Credit & Document;

@Schema({ timestamps: true })
export class Credit {
  @Prop({ required: true, index: true })
  siteId: string;

  @Prop({ required: true, index: true })
  email: string;

  @Prop({ required: true })
  testimonialId: string;

  @Prop({ required: true })
  type: 'video' | 'text';

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'points' })
  currency: string;

  @Prop({ default: false })
  isRedeemed: boolean;

  @Prop()
  redeemedAt?: Date;

  @Prop()
  redemptionCode?: string;

  @Prop({ type: Object })
  metadata: {
    webhookUrl?: string;
    webhookTriggered?: boolean;
    [key: string]: any;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const CreditSchema = SchemaFactory.createForClass(Credit);

