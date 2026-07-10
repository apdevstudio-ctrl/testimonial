'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode, ComponentProps, MouseEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type LinkProps = Omit<ComponentProps<typeof Link>, 'href'>;

function hasStoredSession(token: string | null): boolean {
  if (token) return true;
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(localStorage.getItem('auth_token'));
  } catch {
    return false;
  }
}

/**
 * Resolve CTA destination from the live session (not a stale loading flag).
 * Logged-in → authedHref; guest → guestHref.
 */
export function useAuthCtaHref(guestHref = '/signup', authedHref = '/dashboard') {
  const { token, isAuthenticated } = useAuth();
  const loggedIn = isAuthenticated || hasStoredSession(token);
  return loggedIn ? authedHref : guestHref;
}

export function useIsLoggedIn() {
  const { token, isAuthenticated, isLoading } = useAuth();
  const loggedIn = isAuthenticated || hasStoredSession(token);
  return { loggedIn, isLoading };
}

export function AuthCtaLink({
  children,
  guestHref = '/signup',
  authedHref = '/dashboard',
  className,
  onClick,
  ...rest
}: LinkProps & {
  children: ReactNode;
  guestHref?: string;
  authedHref?: string;
  className?: string;
}) {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Resolve at click time so we never follow a stale /signup href
    const loggedIn = isAuthenticated || hasStoredSession(token);
    const href = loggedIn ? authedHref : guestHref;
    e.preventDefault();
    router.push(href);
  };

  // Prefer authed destination when a session exists (avoids flash to /signup)
  const href = useAuthCtaHref(guestHref, authedHref);

  return (
    <Link href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
