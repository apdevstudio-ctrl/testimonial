import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteDocument = Site & Document;

@Schema({ timestamps: true })
export class Site {
  @Prop({ required: true, unique: true, index: true })
  siteId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  domain?: string;

  @Prop({ type: Object, default: {} })
  button: {
    enabled: boolean;
    type: 'floating' | 'inline';
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    text: string;
    backgroundColor: string;
    textColor: string;
    shape: 'rounded' | 'square' | 'pill';
    size: 'small' | 'medium' | 'large';
    visibility: {
      hideOnMobile: boolean;
      hideOnDesktop: boolean;
      hideAfterSubmission: boolean;
    };
  };

  @Prop({ type: Object, default: {} })
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
    buttonStyle: 'filled' | 'outlined' | 'text';
  };

  @Prop({ type: Object, default: {} })
  enabledFeatures: {
    videoTestimonial: boolean;
    textTestimonial: boolean;
  };

  @Prop({ default: 'modal' })
  flowType: 'modal' | 'drawer' | 'page';

  @Prop({ type: Object, default: {} })
  formDesign?: {
    fields: Array<{
      id: string;
      type: 'text' | 'email' | 'textarea' | 'number' | 'select' | 'checkbox';
      label: string;
      name: string;
      placeholder?: string;
      required: boolean;
      visible: boolean;
      order: number;
      options?: string[];
      min?: number;
      max?: number;
    }>;
    layout: 'single' | 'two-column' | 'three-column';
    showHeader: boolean;
    headerText: string;
    headerSubtext?: string;
    showFooter: boolean;
    footerText?: string;
    submitButtonText: string;
    submitButtonPosition: 'left' | 'center' | 'right' | 'full';
  };

  @Prop({ type: Object, default: {} })
  testimonialDisplay?: {
    layout: 'grid' | 'carousel' | 'list';
    itemsPerRow?: number;
    limit?: number;
    showRating: boolean;
    showAuthor: boolean;
    showVideo: boolean;
    cardStyle: {
      backgroundColor: string;
      textColor: string;
      borderColor: string;
      borderRadius: string;
      padding: string;
      shadow: 'none' | 'small' | 'medium' | 'large';
    };
    authorStyle: {
      showAvatar: boolean;
      avatarSize: string;
      showCompany: boolean;
      showPosition: boolean;
      textColor: string;
    };
    ratingStyle: {
      starColor: string;
      emptyStarColor: string;
      size: 'small' | 'medium' | 'large';
    };
    spacing: {
      gap: string;
      margin: string;
    };
  };

  @Prop({ type: Object, default: {} })
  pageDesign?: {
    hero: {
      enabled: boolean;
      title: string;
      subtitle: string;
      backgroundType: 'color' | 'gradient' | 'image';
      backgroundColor: string;
      backgroundGradient: string;
      backgroundImage?: string;
      textColor: string;
      alignment: 'left' | 'center' | 'right';
      padding: 'small' | 'medium' | 'large';
    };
    content: {
      showBeforeForm: boolean;
      beforeFormText: string;
      showAfterForm: boolean;
      afterFormText: string;
    };
    pageTheme: {
      backgroundColor: string;
      textColor: string;
      containerMaxWidth: string;
      containerPadding: string;
    };
  };

  @Prop()
  ownerId?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const SiteSchema = SchemaFactory.createForClass(Site);

