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
      return NextResponse.json(
        { error: 'Site configuration not found' },
        { status: 404 }
      );
    }

    const origin = req.headers.get('origin') || req.headers.get('referer');

    // Domain validation (optional)
    if (site.domain && origin) {
      try {
        const siteDomain = new URL(site.domain).hostname;
        const requestOrigin = new URL(origin).hostname;
        if (siteDomain !== requestOrigin && !requestOrigin.endsWith(`.${siteDomain}`)) {
          console.warn(`Domain validation failed: ${requestOrigin} not matching ${siteDomain}`);
        }
      } catch (e) {
        // Invalid URLs, skip validation
      }
    }

    const config = {
      siteId: site.siteId,
      button: {
        enabled: site.button?.enabled ?? true,
        type: site.button?.type || 'floating',
        position: site.button?.position || 'bottom-right',
        text: site.button?.text || 'Give Testimonial',
        backgroundColor: site.button?.backgroundColor || '#007bff',
        textColor: site.button?.textColor || '#ffffff',
        shape: site.button?.shape || 'rounded',
        size: site.button?.size || 'medium',
        visibility: site.button?.visibility || {
          hideOnMobile: false,
          hideOnDesktop: false,
          hideAfterSubmission: false,
        },
      },
      theme: site.theme || {
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        fontFamily: 'inherit',
        borderRadius: '8px',
        buttonStyle: 'filled',
      },
      enabledFeatures: {
        videoTestimonial: site.enabledFeatures?.videoTestimonial ?? true,
        textTestimonial: site.enabledFeatures?.textTestimonial ?? true,
      },
      flowType: site.flowType || 'modal',
      formDesign: site.formDesign,
      pageDesign: site.pageDesign,
      testimonialDisplay: site.testimonialDisplay,
      apiUrl: (() => {
        // Get API URL from request headers (works on Vercel and localhost)
        const host = req.headers.get('host') || '';
        const protocol = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
        return host 
          ? `${protocol}://${host}`
          : (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3001');
      })(),
    };

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET');

    return NextResponse.json(config, { headers });
  } catch (error: any) {
    console.error('Get config error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

