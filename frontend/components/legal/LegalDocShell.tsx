import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

type Variant = 'privacy' | 'terms';

export default function LegalDocShell({
  variant,
  children,
}: {
  variant: Variant;
  children: React.ReactNode;
}) {
  const other =
    variant === 'privacy'
      ? { href: '/terms' as const, label: 'Terms' }
      : { href: '/privacy' as const, label: 'Privacy' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <nav className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 h-auto py-3 md:h-16 md:py-0">
            <Link href="/landing" className="flex-shrink-0">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TestiFlow
              </div>
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href={other.href}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                {other.label}
              </Link>
              <Link href="/landing" className="ml-2">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-8 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
