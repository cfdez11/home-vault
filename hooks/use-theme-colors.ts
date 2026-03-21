import { useColorScheme } from '@/hooks/use-color-scheme';
import { darkTokens, lightTokens, ThemeTokens } from '@/lib/theme-tokens';

export type ThemeColors = ThemeTokens;

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTokens : lightTokens;
}
