import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Site from '@/lib/models/Site';

export async function GET(
  req: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    await connectDB();

    const site = await Site.findOne({ siteId: params.siteId }).lean();
    
    if (!site) {
      return new NextResponse('Site not found', { status: 404 });
    }

    // Get API URL from request headers (works on Vercel and localhost)
    const host = req.headers.get('host') || '';
    const protocol = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const apiUrl = host 
      ? `${protocol}://${host}`
      : (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001');
    const pageDesign = site.pageDesign || {
      hero: {
        enabled: true,
        title: 'Share Your Testimonial',
        subtitle: "We'd love to hear about your experience!",
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
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: ${site.theme?.fontFamily || 'system-ui, -apple-system, sans-serif'};
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
    .hero-section h1 {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .hero-section p {
      font-size: 18px;
      opacity: 0.9;
    }
    ` : ''}
    .content-section {
      max-width: ${pageDesign.pageTheme.containerMaxWidth};
      margin: 0 auto;
      padding: ${pageDesign.pageTheme.containerPadding};
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
  <div class="content-section">
    ${pageDesign.content.showBeforeForm ? `<p>${pageDesign.content.beforeFormText}</p>` : ''}
    <div id="testimonial-widget-container"></div>
    ${pageDesign.content.showAfterForm ? `<p>${pageDesign.content.afterFormText}</p>` : ''}
  </div>
  <script src="${apiUrl}/script.js" data-site-id="${params.siteId}"></script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': "frame-ancestors *",
        'Permissions-Policy': 'camera=*, microphone=*',
      },
    });
  } catch (error: any) {
    console.error('Get testimonial form error:', error);
    return new NextResponse('Failed to load testimonial form', { status: 500 });
  }
}

