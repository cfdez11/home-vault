import { useThemePreference } from '@/lib/theme-preference-context';
import { darkTokens, lightTokens, ThemeTokens } from '@/lib/theme-tokens';

export type ThemeColors = ThemeTokens;

export function useThemeColors(): ThemeColors {
  const { effectiveScheme } = useThemePreference();
  return effectiveScheme === 'dark' ? darkTokens : lightTokens;
}
