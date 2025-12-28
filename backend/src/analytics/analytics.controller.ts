import { Controller, Post, Body, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';
import { RateLimitGuard } from '../common/guards';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  @UseGuards(RateLimitGuard)
  async trackEvent(
    @Body() createEventDto: CreateAnalyticsEventDto,
    @Req() req: any,
  ) {
    return this.analyticsService.trackEvent(createEventDto, req);
  }

  @Get('stats')
  async getStats(@Query('siteId') siteId: string) {
    return this.analyticsService.getStats(siteId);
  }
}

