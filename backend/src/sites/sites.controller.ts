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

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.create(createSiteDto);
  }

  @Get()
  findAll() {
    return this.sitesService.findAll();
  }

  @Get(':siteId')
  findOne(@Param('siteId') siteId: string) {
    return this.sitesService.findOne(siteId);
  }

  @Put(':siteId')
  update(@Param('siteId') siteId: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.sitesService.update(siteId, updateSiteDto);
  }

  @Delete(':siteId')
  remove(@Param('siteId') siteId: string) {
    return this.sitesService.remove(siteId);
  }
}

