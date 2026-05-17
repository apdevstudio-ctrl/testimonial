import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/** Unified embed entry — same bundle as /script.js */
export async function GET(req: NextRequest) {
  try {
    const projectRoot = process.cwd();
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
        },
      });
    }

    return new NextResponse(
      "console.warn('TestiFlow embed: build script package first.');",
      {
        status: 200,
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('embed.js error:', error);
    return new NextResponse('Failed to load embed', { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
