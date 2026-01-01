'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Routes that should not show sidebar/header
  const hideLayoutRoutes = ['/signin', '/signup', '/landing'];
  const shouldHideLayout = hideLayoutRoutes.includes(pathname || '') || pathname === '/';

  // Dashboard routes that require authentication
  const protectedRoutes = ['/dashboard', '/pricing', '/sites'];

  useEffect(() => {
    if (!isLoading && !shouldHideLayout) {
      const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route));
      if (isProtectedRoute && !isAuthenticated) {
        router.push('/signin');
      }
    }
  }, [isLoading, isAuthenticated, pathname, shouldHideLayout, router]);

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden md:ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
