import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sites')
@UseGuards(JwtAuthGuard)
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  create(@Body() createSiteDto: CreateSiteDto, @Request() req) {
    const userId = req.user._id.toString();
    return this.sitesService.create(createSiteDto, userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user._id.toString();
    return this.sitesService.findAll(userId);
  }

  @Get(':siteId')
  findOne(@Param('siteId') siteId: string, @Request() req) {
    const userId = req.user._id.toString();
    return this.sitesService.findOne(siteId, userId);
  }

  @Put(':siteId')
  update(@Param('siteId') siteId: string, @Body() updateSiteDto: UpdateSiteDto, @Request() req) {
    const userId = req.user._id.toString();
    return this.sitesService.update(siteId, updateSiteDto, userId);
  }

  @Delete(':siteId')
  remove(@Param('siteId') siteId: string, @Request() req) {
    const userId = req.user._id.toString();
    return this.sitesService.remove(siteId, userId);
  }
}

