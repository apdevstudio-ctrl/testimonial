import {
  Controller,
  Get,
  Post,
  Put,
  Options,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { RateLimitGuard } from '../common/guards';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Options()
  options(@Res() res: any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send();
  }

  @Post()
  @UseGuards(RateLimitGuard)
  @UseInterceptors(FileInterceptor('video'))
  async create(
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: any,
  ) {
    // Access body directly from request (already parsed by multer)
    // This bypasses ValidationPipe validation
    const body = req.body;
    
    // Parse FormData manually - extract only the fields we need
    // FormData with nested notation like metadata[sessionId] gets parsed by multer into nested objects
    const createTestimonialDto: CreateTestimonialDto = {
      siteId: body.siteId,
      type: body.type,
      text: body.text || undefined,
      // Convert rating to number if present and valid (between 1-5)
      rating: body.rating 
        ? (() => {
            const ratingStr = String(body.rating).trim();
            if (!ratingStr) return undefined;
            const ratingNum = parseFloat(ratingStr);
            // Only include rating if it's a valid number between 1-5
            return (!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5) ? ratingNum : undefined;
          })()
        : undefined,
      // Handle author - multer parses nested FormData fields into objects
      author: body.author || undefined,
      // Handle metadata - multer parses nested FormData fields into objects  
      metadata: body.metadata || undefined,
    };

    // Validate required fields
    if (!createTestimonialDto.siteId || !createTestimonialDto.type) {
      throw new HttpException('siteId and type are required', HttpStatus.BAD_REQUEST);
    }

    // Validate type enum
    if (!['video', 'text'].includes(createTestimonialDto.type)) {
      throw new HttpException('type must be either "video" or "text"', HttpStatus.BAD_REQUEST);
    }

    return this.testimonialsService.create(createTestimonialDto, file, req);
  }

  @Get()
  async findAll(@Query('siteId') siteId?: string, @Query('all') all?: string, @Res() res?: any) {
    let testimonials;
    if (siteId) {
      // If 'all=true' is passed, return all testimonials (for admin dashboard)
      // Otherwise, only return published ones (for public widget)
      if (all === 'true') {
        testimonials = await this.testimonialsService.findAllBySiteId(siteId);
      } else {
        testimonials = await this.testimonialsService.findBySiteId(siteId);
      }
    } else {
      testimonials = await this.testimonialsService.findAll();
    }
    
    // Add CORS headers for script access
    if (res) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      return res.json(testimonials);
    }
    return testimonials;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
  ) {
    return this.testimonialsService.update(id, updateTestimonialDto);
  }
}

