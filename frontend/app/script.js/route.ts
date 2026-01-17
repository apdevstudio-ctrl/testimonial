import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const projectRoot = process.cwd();
    
    // Try multiple paths in order of preference:
    // 1. public/script.js (Vercel deployment - copied during build)
    // 2. ../script/dist/testimonial-script.js (local development)
    // 3. Fallback placeholder
    const scriptPaths = [
      path.join(projectRoot, 'public', 'script.js'),
      path.join(projectRoot, '..', 'script', 'dist', 'testimonial-script.js'),
    ];

    let scriptPath: string | null = null;
    for (const potentialPath of scriptPaths) {
      if (fs.existsSync(potentialPath)) {
        scriptPath = potentialPath;
        break;
      }
    }

    if (scriptPath) {
      const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
      
      return new NextResponse(scriptContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // Fallback if script not built
    const fallbackScript = `
      // Testimonial SaaS Script Loader
      // This is a placeholder - build the script package to get the full script
      console.warn('Testimonial script not built yet. Please build the script package.');
      // To build: cd script && npm run build
    `;

    return new NextResponse(fallbackScript, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Get script error:', error);
    return new NextResponse('Failed to load script', { status: 500 });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

