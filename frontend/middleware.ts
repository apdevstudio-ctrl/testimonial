import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LOCALE_COOKIE, resolveLocale } from '@/lib/i18n/config';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;

  if (!existing) {
    const accept = request.headers.get('accept-language');
    const preferred = accept?.split(',')[0]?.trim().split('-')[0];
    const locale = resolveLocale(preferred);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
