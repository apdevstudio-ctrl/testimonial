import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';

export class CreateSiteDto {
  @IsOptional()
  @IsString()
  siteId?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsObject()
  button?: any;

  @IsOptional()
  @IsObject()
  theme?: any;

  @IsOptional()
  @IsObject()
  enabledFeatures?: {
    videoTestimonial?: boolean;
    textTestimonial?: boolean;
  };

  @IsOptional()
  @IsString()
  flowType?: 'modal' | 'drawer' | 'page';

  @IsOptional()
  @IsObject()
  formDesign?: any;

  @IsOptional()
  @IsObject()
  pageDesign?: any;

  @IsOptional()
  @IsObject()
  testimonialDisplay?: any;
}

