import { PartialType } from '@nestjs/mapped-types';
import { CreateTestimonialDto } from './create-testimonial.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

