export const LOCALES = ['en', 'es', 'fr', 'de', 'hi', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_COOKIE = 'testiflow_locale';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  hi: 'हिन्दी',
  pt: 'Português',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  hi: '🇮🇳',
  pt: '🇧🇷',
};

export function isValidLocale(value: string | undefined | null): value is Locale {
  return !!value && LOCALES.includes(value as Locale);
}

export function resolveLocale(value: string | undefined | null): Locale {
  if (isValidLocale(value)) return value;
  const short = value?.slice(0, 2);
  if (isValidLocale(short)) return short;
  return DEFAULT_LOCALE;
}
