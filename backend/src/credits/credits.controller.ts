import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { IssueCreditDto } from './dto/issue-credit.dto';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Post()
  async issueCredit(@Body() issueCreditDto: IssueCreditDto) {
    return this.creditsService.issueCredit(issueCreditDto);
  }

  @Get()
  async getUserCredits(@Query('email') email: string, @Query('siteId') siteId: string) {
    return this.creditsService.getUserCredits(email, siteId);
  }
}

