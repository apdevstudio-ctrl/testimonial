import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditsController } from './credits.controller';
import { CreditsService } from './credits.service';
import { Credit, CreditSchema } from './schemas/credit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Credit.name, schema: CreditSchema }]),
  ],
  controllers: [CreditsController],
  providers: [CreditsService],
  exports: [CreditsService],
})
export class CreditsModule {}

