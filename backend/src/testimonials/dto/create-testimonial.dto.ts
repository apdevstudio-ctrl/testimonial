import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsObject,
  IsEmail,
  Min,
  Max,
} from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  siteId: string;

  @IsEnum(['video', 'text'])
  type: 'video' | 'text';

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsObject()
  author?: {
    name?: string;
    email?: string;
    company?: string;
    position?: string;
    avatar?: string;
  };

  @IsOptional()
  @IsObject()
  metadata?: {
    sessionId?: string;
  };
}

