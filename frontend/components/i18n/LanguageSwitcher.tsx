'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useI18n } from '@/contexts/I18nProvider';
import { LOCALES, LOCALE_FLAGS, LOCALE_LABELS, type Locale } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  darkMode?: boolean;
  compact?: boolean;
  className?: string;
}

export default function LanguageSwitcher({
  darkMode = false,
  compact = false,
  className = '',
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const select = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors ${
          darkMode
            ? 'border-slate-700 bg-slate-900/50 text-slate-200 hover:border-indigo-500'
            : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 shadow-sm'
        }`}
        aria-label={t('language.select')}
        aria-expanded={open}
      >
        <Globe className="h-4 w-4 shrink-0 opacity-70" />
        <span className="text-base leading-none">{LOCALE_FLAGS[locale]}</span>
        {!compact && (
          <span className="hidden sm:inline max-w-[5rem] truncate">{LOCALE_LABELS[locale]}</span>
        )}
        <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-1 min-w-[10rem] rounded-xl border shadow-lg z-[70] py-1 overflow-hidden ${
            darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
          }`}
          role="listbox"
        >
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={locale === code}
              onClick={() => select(code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                locale === code
                  ? darkMode
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'bg-indigo-50 text-indigo-700'
                  : darkMode
                    ? 'text-slate-200 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{LOCALE_FLAGS[code]}</span>
              <span>{LOCALE_LABELS[code]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
