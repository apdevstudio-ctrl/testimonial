'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import Button from '@/components/ui/Button';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { AuthCtaLink } from '@/components/auth/AuthCtaLink';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nProvider';

interface LandingNavProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function LandingNav({ darkMode, onToggleDark }: LandingNavProps) {
  const { t } = useI18n();
  const { isAuthenticated, isLoading } = useAuth();
  const showDashboard = !isLoading && isAuthenticated;

  return (
    <nav
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        darkMode ? 'border-slate-800/80 bg-slate-950/80' : 'border-gray-200/80 bg-white/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              TestiFlow
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#demo" className={darkMode ? 'text-slate-300 hover:text-white text-sm' : 'text-gray-600 hover:text-gray-900 text-sm'}>
              {t('nav.liveDemo')}
            </a>
            <a href="#features" className={darkMode ? 'text-slate-300 hover:text-white text-sm' : 'text-gray-600 hover:text-gray-900 text-sm'}>
              {t('nav.features')}
            </a>
            <Link href="/examples" className={darkMode ? 'text-slate-300 hover:text-white text-sm' : 'text-gray-600 hover:text-gray-900 text-sm'}>
              {t('nav.examples')}
            </Link>
            <Link href="/docs/playground" className={darkMode ? 'text-slate-300 hover:text-white text-sm' : 'text-gray-600 hover:text-gray-900 text-sm'}>
              {t('nav.playground')}
            </Link>
            <a href="#pricing" className={darkMode ? 'text-slate-300 hover:text-white text-sm' : 'text-gray-600 hover:text-gray-900 text-sm'}>
              {t('nav.pricing')}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleDark}
              className={`p-2 rounded-lg ${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-gray-500 hover:bg-gray-100'}`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {showDashboard ? (
              <Link href="/dashboard" className={`hidden sm:block text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                Dashboard
              </Link>
            ) : (
              <Link href="/signin" className={`hidden sm:block text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {t('nav.signIn')}
              </Link>
            )}
            <LanguageSwitcher darkMode={darkMode} compact />
            <AuthCtaLink>
              <Button variant="primary" size="sm">
                {showDashboard ? 'Dashboard' : t('nav.startFree')}
              </Button>
            </AuthCtaLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
