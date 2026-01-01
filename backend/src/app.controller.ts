import { Controller, Get, Options, Res, Param, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('script.js')
  getScript(@Res() res: Response) {
    // Set comprehensive CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // In production, serve from built script
    // For development, we'll return a placeholder that loads the actual script
    // Calculate path: __dirname in compiled code is backend/dist, so go up 2 levels to project root
    const projectRoot = path.resolve(__dirname, '..', '..');
    const scriptPath = path.join(projectRoot, 'script', 'dist', 'testimonial-script.js');
    
    // Also try process.cwd() as fallback (when running from project root)
    const altScriptPath = path.join(process.cwd(), 'script', 'dist', 'testimonial-script.js');
    
    const finalPath = fs.existsSync(scriptPath) ? scriptPath : 
                     (fs.existsSync(altScriptPath) ? altScriptPath : null);
    
    if (finalPath) {
      return res.sendFile(path.resolve(finalPath));
    }
    
    // Fallback: return inline script that loads from CDN or development server
    res.send(`
      // Testimonial SaaS Script Loader
      // This is a placeholder - build the script package to get the full script
      console.warn('Testimonial script not built yet. Please build the script package.');
    `);
  }
  
  @Options('script.js')
  optionsScript(@Res() res: Response) {
    // Handle preflight OPTIONS request
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).send();
  }

}

