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
    return {
      siteId: site.siteId,
      button: site.button,
      theme: site.theme,
      enabledFeatures: site.enabledFeatures,
      flowType: site.flowType,
      formDesign: site.formDesign, // Include custom form design
      pageDesign: site.pageDesign, // Include page design for testimonial page
      testimonialDisplay: site.testimonialDisplay, // Include testimonial display configuration
      apiUrl: process.env.API_URL || process.env.SCRIPT_URL || 'http://localhost:3000',
    };
  }
}

