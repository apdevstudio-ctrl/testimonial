export type WidgetThemePreset =
  | 'minimal'
  | 'glass'
  | 'bold'
  | 'saas'
  | 'dark'
  | 'warm'
  | 'ocean'
  | 'sunset';

export interface WidgetThemeConfig {
  id: WidgetThemePreset;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardBackground: string;
  textColor: string;
  mutedColor: string;
  borderRadius: string;
  fontFamily: string;
  cardShadow: string;
}

export const WIDGET_THEME_PRESETS: Record<WidgetThemePreset, WidgetThemeConfig> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean white cards, subtle borders',
    primaryColor: '#18181b',
    secondaryColor: '#71717a',
    backgroundColor: '#fafafa',
    cardBackground: '#ffffff',
    textColor: '#18181b',
    mutedColor: '#71717a',
    borderRadius: '12px',
    fontFamily: 'Inter, system-ui, sans-serif',
    cardShadow: '0 1px 3px rgb(0 0 0 / 0.06)',
  },
  glass: {
    id: 'glass',
    name: 'Glass',
    description: 'Frosted glass with blur',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBackground: 'rgba(255,255,255,0.12)',
    textColor: '#ffffff',
    mutedColor: 'rgba(255,255,255,0.75)',
    borderRadius: '16px',
    fontFamily: 'Inter, system-ui, sans-serif',
    cardShadow: '0 8px 32px rgb(0 0 0 / 0.12)',
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    description: 'High contrast, strong typography',
    primaryColor: '#dc2626',
    secondaryColor: '#f97316',
    backgroundColor: '#0a0a0a',
    cardBackground: '#171717',
    textColor: '#fafafa',
    mutedColor: '#a3a3a3',
    borderRadius: '8px',
    fontFamily: 'Inter, system-ui, sans-serif',
    cardShadow: '0 4px 24px rgb(220 38 38 / 0.15)',
  },
  saas: {
    id: 'saas',
    name: 'SaaS',
    description: 'Indigo accent, modern startup feel',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#f8fafc',
    cardBackground: '#ffffff',
    textColor: '#0f172a',
    mutedColor: '#64748b',
    borderRadius: '12px',
    fontFamily: 'Inter, system-ui, sans-serif',
    cardShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Premium dark mode wall',
    primaryColor: '#a78bfa',
    secondaryColor: '#6366f1',
    backgroundColor: '#09090b',
    cardBackground: '#18181b',
    textColor: '#fafafa',
    mutedColor: '#a1a1aa',
    borderRadius: '14px',
    fontFamily: 'Inter, system-ui, sans-serif',
    cardShadow: '0 0 0 1px rgb(255 255 255 / 0.06)',
  },
  warm: {
    id: 'warm',
    name: 'Warm',
    description: 'Amber tones, friendly feel',
    primaryColor: '#d97706',
    secondaryColor: '#ea580c',
    backgroundColor: '#fffbeb',
    cardBackground: '#ffffff',
    textColor: '#292524',
    mutedColor: '#78716c',
    borderRadius: '16px',
    fontFamily: 'Georgia, serif',
    cardShadow: '0 2px 8px rgb(217 119 6 / 0.1)',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calm blues and teals',
    primaryColor: '#0891b2',
    secondaryColor: '#0284c7',
    backgroundColor: '#ecfeff',
    cardBackground: '#ffffff',
    textColor: '#164e63',
    mutedColor: '#64748b',
    borderRadius: '12px',
    fontFamily: 'Inter, system-ui, sans-serif',
    cardShadow: '0 4px 14px rgb(8 145 178 / 0.12)',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Gradient-inspired pink and violet',
    primaryColor: '#db2777',
    secondaryColor: '#7c3aed',
    backgroundColor: 'linear-gradient(180deg, #fdf2f8 0%, #faf5ff 100%)',
    cardBackground: '#ffffff',
    textColor: '#1f2937',
    mutedColor: '#6b7280',
    borderRadius: '20px',
    fontFamily: 'Inter, system-ui, sans-serif',
    cardShadow: '0 8px 30px rgb(219 39 119 / 0.1)',
  },
};

export const WIDGET_THEME_LIST = Object.values(WIDGET_THEME_PRESETS);
