import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { RateLimitGuard } from '../common/guards';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @UseGuards(RateLimitGuard)
  @UseInterceptors(FileInterceptor('video'))
  async create(
    @Body() createTestimonialDto: CreateTestimonialDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: any,
  ) {
    return this.testimonialsService.create(createTestimonialDto, file, req);
  }

  @Get()
  async findAll(@Query('siteId') siteId?: string, @Res() res?: any) {
    let testimonials;
    if (siteId) {
      // For public API, only return published testimonials
      testimonials = await this.testimonialsService.findBySiteId(siteId);
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

