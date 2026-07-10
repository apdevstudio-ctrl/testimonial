'use client';

import Link from 'next/link';
import { AuthCtaLink } from '@/components/auth/AuthCtaLink';
import { useAuth } from '@/contexts/AuthContext';

export default function IntegrationsNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const showDashboard = !isLoading && isAuthenticated;

  return (
    <nav className="border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 dark:text-white">
          TestiFlow
        </Link>
        <div className="flex gap-4 text-sm items-center">
          <Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            Pricing
          </Link>
          {showDashboard ? (
            <Link
              href="/dashboard"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Dashboard
            </Link>
          ) : (
            <AuthCtaLink className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300">
              Sign up
            </AuthCtaLink>
          )}
        </div>
      </div>
    </nav>
  );
}
