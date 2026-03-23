import React from 'react';
import { vars } from 'nativewind';
import { View } from 'react-native';
import { useThemePreference } from '@/lib/theme-preference-context';
import { lightTokens, darkTokens, ThemeTokens } from '@/lib/theme-tokens';

function toVars(tokens: ThemeTokens): Record<string, string> {
  const result: Record<string, string> = {
    '--radius': '24px',
    '--radius-md': '16px',
    '--radius-sm': '12px',
  };
  for (const [key, value] of Object.entries(tokens)) {
    const cssVar = '--' + key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
    result[cssVar] = value;
  }
  return result;
}

const lightVars = vars(toVars(lightTokens));
const darkVars = vars(toVars(darkTokens));

export function NativewindThemeProvider({ children }: { children: React.ReactNode }) {
  const { effectiveScheme } = useThemePreference();
  return (
    <View style={[{ flex: 1 }, effectiveScheme === 'dark' ? darkVars : lightVars]}>
      {children}
    </View>
  );
}
