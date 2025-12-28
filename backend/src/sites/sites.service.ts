import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from './schemas/site.schema';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private siteModel: Model<SiteDocument>) {}

  async create(createSiteDto: CreateSiteDto): Promise<Site> {
    // Check if siteId already exists
    const existing = await this.siteModel.findOne({ siteId: createSiteDto.siteId }).exec();
    if (existing) {
      throw new ConflictException(`Site with siteId ${createSiteDto.siteId} already exists`);
    }

    const createdSite = new this.siteModel({
      ...createSiteDto,
      button: {
        enabled: true,
        type: 'floating',
        position: 'bottom-right',
        text: 'Give Testimonial',
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        shape: 'rounded',
        size: 'medium',
        visibility: {
          hideOnMobile: false,
          hideOnDesktop: false,
          hideAfterSubmission: false,
        },
        ...createSiteDto.button,
      },
      theme: {
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        fontFamily: 'inherit',
        borderRadius: '8px',
        buttonStyle: 'filled',
        ...createSiteDto.theme,
      },
      enabledFeatures: {
        videoTestimonial: true,
        textTestimonial: true,
        ...createSiteDto.enabledFeatures,
      },
    });
    return createdSite.save();
  }

  async findAll(): Promise<Site[]> {
    return this.siteModel.find().exec();
  }

  async findOne(siteId: string): Promise<Site> {
    const site = await this.siteModel.findOne({ siteId }).exec();
    if (!site) {
      throw new NotFoundException(`Site with siteId ${siteId} not found`);
    }
    return site;
  }

  async update(siteId: string, updateSiteDto: UpdateSiteDto): Promise<Site> {
    const updatedSite = await this.siteModel
      .findOneAndUpdate({ siteId }, updateSiteDto, { new: true })
      .exec();
    if (!updatedSite) {
      throw new NotFoundException(`Site with siteId ${siteId} not found`);
    }
    return updatedSite;
  }

  async remove(siteId: string): Promise<void> {
    const result = await this.siteModel.deleteOne({ siteId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Site with siteId ${siteId} not found`);
    }
  }
}

