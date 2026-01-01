import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './schemas/testimonial.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreditsService } from '../credits/credits.service';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name)
    private testimonialModel: Model<TestimonialDocument>,
    private cloudinaryService: CloudinaryService,
    @Inject(forwardRef(() => CreditsService))
    private creditsService: CreditsService,
  ) {}

  async create(
    createTestimonialDto: CreateTestimonialDto,
    file?: Express.Multer.File,
    req?: any,
  ): Promise<Testimonial> {
    let videoUrl: string | undefined;
    let videoThumbnail: string | undefined;

    if (file && createTestimonialDto.type === 'video') {
      const uploadResult = await this.cloudinaryService.uploadVideo(file);
      videoUrl = uploadResult.url;
      videoThumbnail = uploadResult.thumbnail;
    }

    const testimonialData: any = {
      ...createTestimonialDto,
      videoUrl,
      videoThumbnail,
      metadata: {
        userAgent: req?.headers['user-agent'],
        ipAddress: req?.ip || req?.connection?.remoteAddress,
        referrer: req?.headers['referer'],
        sessionId: createTestimonialDto.metadata?.sessionId,
      },
    };

    const testimonial = new this.testimonialModel(testimonialData);
    const savedTestimonial = await testimonial.save();

    // Issue credit for testimonial submission
    if (createTestimonialDto.author?.email) {
      await this.creditsService.issueCredit({
        siteId: createTestimonialDto.siteId,
        email: createTestimonialDto.author.email,
        testimonialId: savedTestimonial._id.toString(),
        type: createTestimonialDto.type,
      });
    }

    return savedTestimonial;
  }

  async findAll(): Promise<Testimonial[]> {
    return this.testimonialModel.find().exec();
  }

  async findBySiteId(siteId: string): Promise<Testimonial[]> {
    return this.testimonialModel.find({ siteId, isPublished: true }).exec();
  }

  async findAllBySiteId(siteId: string): Promise<Testimonial[]> {
    return this.testimonialModel.find({ siteId }).exec();
  }

  async findOne(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialModel.findById(id).exec();
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return testimonial;
  }

  async update(
    id: string,
    updateTestimonialDto: UpdateTestimonialDto,
  ): Promise<Testimonial> {
    const updatedTestimonial = await this.testimonialModel
      .findByIdAndUpdate(id, updateTestimonialDto, { new: true })
      .exec();
    if (!updatedTestimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return updatedTestimonial;
  }
}

