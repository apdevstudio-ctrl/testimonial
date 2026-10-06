const FUNNEL = [
  'landing',
  'signup',
  'authenticated',
  'dashboard',
  'site_created',
  'quote_added',
  'embed_copied',
] as const;

export type FunnelStep = (typeof FUNNEL)[number];

const FUNNEL_KEY = 'testiflow_funnel_step';

type ClarityCommand = (...args: unknown[]) => void;

function clarityCall(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  const clarity = (window as Window & { clarity?: ClarityCommand }).clarity;
  if (typeof clarity !== 'function') return;
  clarity(...args);
}

export function trackClarity(event: string, tags?: Record<string, string>) {
  if (tags) {
    for (const [key, value] of Object.entries(tags)) {
      clarityCall('set', key.slice(0, 255), value.slice(0, 255));
    }
  }
  clarityCall('event', event.slice(0, 255));
}

export function advanceFunnel(step: FunnelStep) {
  if (typeof window === 'undefined') return;
  const current = sessionStorage.getItem(FUNNEL_KEY) || '';
  const currentRank = FUNNEL.indexOf(current as FunnelStep);
  const nextRank = FUNNEL.indexOf(step);
  const stored = nextRank >= currentRank ? step : current || step;
  sessionStorage.setItem(FUNNEL_KEY, stored);
  clarityCall('set', 'funnel_step', stored);
}

export function currentFunnelStep(): string {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem(FUNNEL_KEY) || '';
}

export function identifyClarityUser(userId: string) {
  if (!userId) return;
  clarityCall('identify', userId);
  clarityCall('set', 'logged_in', 'true');
  advanceFunnel('authenticated');
}

export function pathFunnelStep(pathname: string): FunnelStep | null {
  if (pathname === '/') return 'landing';
  if (pathname === '/signup' || pathname === '/signin') return 'signup';
  if (pathname === '/dashboard') return 'dashboard';
  return null;
}
