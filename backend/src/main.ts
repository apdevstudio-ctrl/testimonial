import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cors from 'cors';
import { AppModule } from './app.module';
import { ConfigService as SiteConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Get ConfigService instance for testimonial form route
  const siteConfigService = app.get(SiteConfigService);

  // Security
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for script injection
    crossOriginEmbedderPolicy: false, // Allow cross-origin embedding
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin resources
    frameguard: false, // Allow iframe embedding for testimonial pages
  }));
  app.use(
    cors({
      origin: [
        configService.get('FRONTEND_URL') || 'http://localhost:3001',
        configService.get('SCRIPT_URL') || 'http://localhost:3000',
        // Allow all origins for script injection (can be restricted in production)
        /^https?:\/\/.*$/,
      ],
      credentials: true,
    }),
  );

  // Register testimonial-form route BEFORE global prefix
  // This route needs to be accessible without /api prefix
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/testimonial-form/:siteId', async (req: any, res: any) => {
    try {
      const { siteId } = req.params;
      const config = await siteConfigService.getSiteConfig(siteId);
      if (!config) {
        return res.status(404).json({ message: 'Site not found', error: 'Not Found', statusCode: 404 });
      }

      const apiUrl = process.env.API_URL || process.env.SCRIPT_URL || 'http://localhost:3000';
      const pageDesign = config.pageDesign || {
        hero: {
          enabled: true,
          title: 'Share Your Testimonial',
          subtitle: 'We\'d love to hear about your experience!',
          backgroundType: 'gradient',
          backgroundColor: '#667eea',
          backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          textColor: '#ffffff',
          alignment: 'center',
          padding: 'large',
        },
        content: {
          showBeforeForm: false,
          beforeFormText: '',
          showAfterForm: false,
          afterFormText: '',
        },
        pageTheme: {
          backgroundColor: '#f9fafb',
          textColor: '#111827',
          containerMaxWidth: '800px',
          containerPadding: '40px',
        },
      };

      const heroBackground = pageDesign.hero.backgroundType === 'color'
        ? pageDesign.hero.backgroundColor
        : pageDesign.hero.backgroundType === 'gradient'
        ? pageDesign.hero.backgroundGradient
        : pageDesign.hero.backgroundImage
        ? `url(${pageDesign.hero.backgroundImage})`
        : pageDesign.hero.backgroundColor;

      const heroPadding = pageDesign.hero.padding === 'small' ? '32px 24px'
        : pageDesign.hero.padding === 'medium' ? '64px 32px'
        : '96px 40px';

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageDesign.hero.title || 'Share Your Testimonial'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${config.theme.fontFamily || 'system-ui, -apple-system, sans-serif'};
      background: ${pageDesign.pageTheme.backgroundColor};
      color: ${pageDesign.pageTheme.textColor};
      min-height: 100vh;
      padding: 20px;
    }
    ${pageDesign.hero.enabled ? `
    .hero-section {
      background: ${heroBackground};
      background-size: ${pageDesign.hero.backgroundType === 'image' ? 'cover' : 'auto'};
      background-position: center;
      color: ${pageDesign.hero.textColor};
      padding: ${heroPadding};
      text-align: ${pageDesign.hero.alignment};
      margin-bottom: 40px;
    }
    .hero-section h1 { font-size: 32px; font-weight: bold; margin-bottom: 12px; }
    .hero-section p { font-size: 18px; opacity: 0.9; }
    ` : ''}
    .content-section {
      max-width: ${pageDesign.pageTheme.containerMaxWidth};
      margin: 0 auto;
      padding: ${pageDesign.pageTheme.containerPadding};
      color: ${pageDesign.pageTheme.textColor};
      line-height: 1.6;
    }
    .form-container {
      max-width: ${pageDesign.pageTheme.containerMaxWidth};
      margin: 0 auto;
      padding: ${pageDesign.pageTheme.containerPadding};
    }
    .form-wrapper {
      background: white;
      border-radius: ${config.theme.borderRadius || '16px'};
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      padding: 40px;
    }
  </style>
</head>
<body>
  ${pageDesign.hero.enabled ? `
  <div class="hero-section">
    <h1>${pageDesign.hero.title}</h1>
    <p>${pageDesign.hero.subtitle}</p>
  </div>
  ` : ''}
  ${pageDesign.content.showBeforeForm && pageDesign.content.beforeFormText ? `
  <div class="content-section">${pageDesign.content.beforeFormText.replace(/\n/g, '<br />')}</div>
  ` : ''}
  <div class="form-container">
    <div class="form-wrapper">
      <div id="testimonial-widget-container"></div>
    </div>
  </div>
  ${pageDesign.content.showAfterForm && pageDesign.content.afterFormText ? `
  <div class="content-section">${pageDesign.content.afterFormText.replace(/\n/g, '<br />')}</div>
  ` : ''}
  <script src="${apiUrl}/api/script.js" data-site-id="${siteId}" data-api-url="${apiUrl}"></script>
  <script>
    if (window.TestimonialWidget) {
      const widget = new window.TestimonialWidget('${siteId}', '${apiUrl}');
      setTimeout(() => {
        if (widget.config) {
          const container = document.getElementById('testimonial-widget-container');
          if (container) {
            const content = widget.createTestimonialContent();
            container.appendChild(content);
            const typeSelector = content.querySelector('div[style*="display: flex"]');
            if (typeSelector) {
              const buttons = typeSelector.querySelectorAll('button');
              if (buttons.length === 1) buttons[0].click();
            }
          }
        }
      }, 500);
    }
  </script>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.removeHeader('X-Frame-Options');
      res.setHeader('Content-Security-Policy', "frame-ancestors *");
      // Allow camera and microphone access in iframe
      res.setHeader('Permissions-Policy', 'camera=*, microphone=*');
      res.send(html);
    } catch (error: any) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global prefix for API routes
  app.setGlobalPrefix('api');

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
}

bootstrap();
