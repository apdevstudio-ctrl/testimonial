import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from '../sites/schemas/site.schema';

@Injectable()
export class ConfigService {
  constructor(
    @InjectModel(Site.name) private siteModel: Model<SiteDocument>,
  ) {}

  async getSiteConfig(siteId: string, origin?: string) {
    const site = await this.siteModel.findOne({ siteId }).lean();
    if (!site) {
      return null;
    }

    // Domain validation (optional - can be enabled per site)
    if (site.domain && origin) {
      try {
        const siteDomain = new URL(site.domain).hostname;
        const requestOrigin = new URL(origin).hostname;
        if (siteDomain !== requestOrigin && !requestOrigin.endsWith(`.${siteDomain}`)) {
          // Domain mismatch - you can choose to block or warn
          console.warn(`Domain validation failed: ${requestOrigin} not matching ${siteDomain}`);
        }
      } catch (e) {
        // Invalid URLs, skip validation
      }
    }

    // Return only public configuration (no sensitive data)
    // Provide defaults for missing fields to ensure script works correctly
    return {
      siteId: site.siteId,
      button: {
        enabled: site.button?.enabled ?? true, // Default to true if missing
        type: site.button?.type || 'floating',
        position: site.button?.position || 'bottom-right',
        text: site.button?.text || 'Give Testimonial',
        backgroundColor: site.button?.backgroundColor || '#007bff',
        textColor: site.button?.textColor || '#ffffff',
        shape: site.button?.shape || 'rounded',
        size: site.button?.size || 'medium',
        visibility: site.button?.visibility || {
          hideOnMobile: false,
          hideOnDesktop: false,
          hideAfterSubmission: false,
        },
      },
      theme: site.theme || {
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        fontFamily: 'inherit',
        borderRadius: '8px',
        buttonStyle: 'filled',
      },
      enabledFeatures: {
        videoTestimonial: site.enabledFeatures?.videoTestimonial ?? true, // Default to true
        textTestimonial: site.enabledFeatures?.textTestimonial ?? true, // Default to true
      },
      flowType: site.flowType || 'modal',
      formDesign: site.formDesign, // Include custom form design
      pageDesign: site.pageDesign, // Include page design for testimonial page
      testimonialDisplay: site.testimonialDisplay, // Include testimonial display configuration
      apiUrl: process.env.API_URL || process.env.SCRIPT_URL || 'http://localhost:3000',
    };
  }
}

