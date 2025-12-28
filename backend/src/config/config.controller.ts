import { Controller, Get, Param, Res, Req, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get(':siteId')
  async getConfig(
    @Param('siteId') siteId: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const origin = req.headers.origin || req.headers.referer;
      const config = await this.configService.getSiteConfig(siteId, origin);
      if (!config) {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: 'Site configuration not found',
        });
      }
      // CORS headers for script access
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      return res.json(config);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to fetch configuration',
      });
    }
  }
}

