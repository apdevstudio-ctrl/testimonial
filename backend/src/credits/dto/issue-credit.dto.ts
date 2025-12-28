import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export class IssueCreditDto {
  @IsString()
  siteId: string;

  @IsString()
  email: string;

  @IsString()
  testimonialId: string;

  @IsEnum(['video', 'text'])
  type: 'video' | 'text';

  @IsOptional()
  @IsObject()
  metadata?: {
    webhookUrl?: string;
    [key: string]: any;
  };
}

