import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';
import { Site, SiteDocument } from './schemas/site.schema';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private siteModel: Model<SiteDocument>) {}

  async create(createSiteDto: CreateSiteDto, userId: string): Promise<Site> {
    // Generate UUID for siteId if not provided
    let siteId = createSiteDto.siteId;
    if (!siteId) {
      siteId = randomUUID();
    }

    // Check if siteId already exists for this user (siteId can be same across different users)
    const existing = await this.siteModel.findOne({ siteId, userId }).exec();
    if (existing) {
      throw new ConflictException(`Site with siteId ${siteId} already exists`);
    }

    const createdSite = new this.siteModel({
      ...createSiteDto,
      siteId,
      userId,
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

  async findAll(userId: string): Promise<Site[]> {
    return this.siteModel.find({ userId }).exec();
  }

  async findOne(siteId: string, userId: string): Promise<Site> {
    const site = await this.siteModel.findOne({ siteId, userId }).exec();
    if (!site) {
      throw new NotFoundException(`Site with siteId ${siteId} not found`);
    }
    return site;
  }

  async update(siteId: string, updateSiteDto: UpdateSiteDto, userId: string): Promise<Site> {
    // First check if site exists and belongs to user
    const site = await this.siteModel.findOne({ siteId, userId }).exec();
    if (!site) {
      throw new NotFoundException(`Site with siteId ${siteId} not found`);
    }

    const updatedSite = await this.siteModel
      .findOneAndUpdate({ siteId, userId }, updateSiteDto, { new: true })
      .exec();
    if (!updatedSite) {
      throw new NotFoundException(`Site with siteId ${siteId} not found`);
    }
    return updatedSite;
  }

  async remove(siteId: string, userId: string): Promise<void> {
    // First check if site exists and belongs to user
    const site = await this.siteModel.findOne({ siteId, userId }).exec();
    if (!site) {
      throw new NotFoundException(`Site with siteId ${siteId} not found`);
    }

    const result = await this.siteModel.deleteOne({ siteId, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Site with siteId ${siteId} not found`);
    }
  }
}

