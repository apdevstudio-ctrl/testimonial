'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  advanceFunnel,
  currentFunnelStep,
  identifyClarityUser,
  pathFunnelStep,
  trackClarity,
} from '@/lib/analytics/clarity';

export default function ClarityTracker() {
  const pathname = usePathname() || '/';
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (user?._id) identifyClarityUser(user._id);
  }, [user?._id]);

  useEffect(() => {
    const step = pathFunnelStep(pathname);
    if (step) advanceFunnel(step);
    trackClarity('page_view', {
      path: pathname,
      logged_in: isAuthenticated ? 'true' : 'false',
      funnel_step: currentFunnelStep() || step || 'browsing',
    });
  }, [pathname, isAuthenticated]);

  useEffect(() => {
    const leave = () => {
      trackClarity('left_site', {
        last_path: window.location.pathname,
        funnel_step: currentFunnelStep() || 'unknown',
        logged_in: localStorage.getItem('auth_token') ? 'true' : 'false',
      });
    };
    window.addEventListener('pagehide', leave);
    return () => window.removeEventListener('pagehide', leave);
  }, []);

  return null;
}
