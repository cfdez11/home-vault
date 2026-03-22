/**
 * Single source of truth for all theme color values.
 * - `nativewind-theme-provider` uses these to inject CSS variables on native.
 * - `use-theme-colors` uses these to expose JS values for icon/shadow colors.
 * - `globals.css` mirrors these values for web (CSS variables).
 */

export const lightTokens = {
  background: '#F8FAFC',
  foreground: '#0F172A',

  card: '#FFFFFF',
  cardForeground: '#0F172A',

  popover: '#FFFFFF',
  popoverForeground: '#0F172A',

  primary: '#1E3A8A',
  primaryForeground: '#F8FAFC',
  primarySubtle: '#DBEAFE',

  secondary: '#64748B',
  secondaryForeground: '#F8FAFC',

  muted: '#F1F5F9',
  mutedForeground: '#64748B',

  accent: '#0EA5E9',
  accentForeground: '#0F172A',
  accentSubtle: '#E0F2FE',

  destructive: '#BA1A1A',
  destructiveForeground: '#F8FAFC',
  destructiveSubtle: '#FFDAD6',

  border: '#E2E8F0',
  input: '#E2E8F0',
  ring: '#1E3A8A',

  success: '#16A34A',
  successForeground: '#F8FAFC',
  successSubtle: '#DCFCE7',

  warning: '#D97706',
  warningForeground: '#0F172A',
  warningSubtle: '#FEF3C7',

  caution: '#CA8A04',
  cautionForeground: '#0F172A',
  cautionSubtle: '#FEF9C3',
} as const;

export const darkTokens = {
  background: '#0F172A',
  foreground: '#F8FAFC',

  card: '#1E293B',
  cardForeground: '#F8FAFC',

  popover: '#1E293B',
  popoverForeground: '#F8FAFC',

  primary: '#93C5FD',
  primaryForeground: '#1E3A8A',
  primarySubtle: '#1E3A8A',

  secondary: '#94A3B8',
  secondaryForeground: '#0F172A',

  muted: '#1E293B',
  mutedForeground: '#94A3B8',

  accent: '#38BDF8',
  accentForeground: '#0F172A',
  accentSubtle: '#075985',

  destructive: '#F87171',
  destructiveForeground: '#0F172A',
  destructiveSubtle: '#7F1D1D',

  border: '#334155',
  input: '#334155',
  ring: '#93C5FD',

  success: '#4ADE80',
  successForeground: '#0F172A',
  successSubtle: '#14532D',

  warning: '#FCD34D',
  warningForeground: '#0F172A',
  warningSubtle: '#78350F',

  caution: '#FDE047',
  cautionForeground: '#0F172A',
  cautionSubtle: '#713F12',
} as const;

export type ThemeTokens = typeof lightTokens;
