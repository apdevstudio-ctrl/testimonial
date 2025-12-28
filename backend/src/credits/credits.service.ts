import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Credit, CreditDocument } from './schemas/credit.schema';
import { IssueCreditDto } from './dto/issue-credit.dto';

@Injectable()
export class CreditsService {
  constructor(
    @InjectModel(Credit.name) private creditModel: Model<CreditDocument>,
  ) {}

  async issueCredit(issueCreditDto: IssueCreditDto): Promise<Credit> {
    // Determine credit amount based on type
    const amount = issueCreditDto.type === 'video' ? 10 : 5; // Video testimonials worth more

    const credit = new this.creditModel({
      ...issueCreditDto,
      amount,
      currency: 'points',
      redemptionCode: this.generateRedemptionCode(),
    });

    const savedCredit = await credit.save();

    // Trigger webhook if configured
    if (issueCreditDto.metadata?.webhookUrl) {
      await this.triggerWebhook(issueCreditDto.metadata.webhookUrl, savedCredit);
    }

    return savedCredit;
  }

  async getUserCredits(email: string, siteId: string): Promise<Credit[]> {
    return this.creditModel.find({ email, siteId, isRedeemed: false }).exec();
  }

  private generateRedemptionCode(): string {
    return `CREDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  private async triggerWebhook(webhookUrl: string, credit: CreditDocument): Promise<void> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'credit_issued',
          credit: {
            id: credit._id,
            email: credit.email,
            amount: credit.amount,
            currency: credit.currency,
            type: credit.type,
            redemptionCode: credit.redemptionCode,
            createdAt: credit.createdAt,
          },
        }),
      });

      if (response.ok) {
        await this.creditModel.updateOne(
          { _id: credit._id },
          { 'metadata.webhookTriggered': true },
        );
      }
    } catch (error) {
      console.error('Webhook trigger failed:', error);
    }
  }
}

