'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/contexts/I18nProvider';
import type { Locale } from '@/lib/i18n/config';

export default function AppProviders({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      {children}
    </I18nProvider>
  );
}
