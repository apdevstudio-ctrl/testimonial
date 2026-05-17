import type { WidgetThemePreset } from '@/lib/widgetThemes';

export type WallLayout =
  | 'grid'
  | 'carousel'
  | 'marquee'
  | 'list'
  | 'bento'
  | 'masonry'
  | 'floating'
  | 'columns';

export interface WidgetCustomizeConfig {
  themePreset: WidgetThemePreset;
  layout: WallLayout;
  spacing: number;
  borderRadius: number;
  shadow: 'none' | 'sm' | 'md' | 'lg';
  cardWidth: 'auto' | 'sm' | 'md' | 'lg';
  avatarSize: number;
  typographyScale: number;
  gradientIntensity: number;
  animationStyle: 'none' | 'subtle' | 'spring' | 'glow';
  colorMode: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  autoplaySpeed: number;
  limit: number;
  hideBranding: boolean;
}

export const DEFAULT_CUSTOMIZE: WidgetCustomizeConfig = {
  themePreset: 'saas',
  layout: 'grid',
  spacing: 16,
  borderRadius: 12,
  shadow: 'md',
  cardWidth: 'auto',
  avatarSize: 40,
  typographyScale: 1,
  gradientIntensity: 0.5,
  animationStyle: 'subtle',
  colorMode: 'auto',
  autoplaySpeed: 40,
  limit: 24,
  hideBranding: false,
};

export function mergeCustomize(
  partial?: Partial<WidgetCustomizeConfig> | null
): WidgetCustomizeConfig {
  return { ...DEFAULT_CUSTOMIZE, ...partial };
}

export function shadowCss(level: WidgetCustomizeConfig['shadow']): string {
  const map = {
    none: 'none',
    sm: '0 1px 3px rgb(0 0 0 / 0.08)',
    md: '0 4px 14px rgb(0 0 0 / 0.1)',
    lg: '0 12px 40px rgb(0 0 0 / 0.12)',
  };
  return map[level];
}
