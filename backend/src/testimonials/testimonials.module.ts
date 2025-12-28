import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';
import { Testimonial, TestimonialSchema } from './schemas/testimonial.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CreditsModule } from '../credits/credits.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Testimonial.name, schema: TestimonialSchema },
    ]),
    CloudinaryModule,
    forwardRef(() => CreditsModule),
  ],
  controllers: [TestimonialsController],
  providers: [TestimonialsService],
  exports: [TestimonialsService],
})
export class TestimonialsModule {}

