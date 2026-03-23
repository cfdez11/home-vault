import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { NativewindThemeProvider } from "@/components/ui/nativewind-theme-provider";
import { AuthProvider } from "@/features/auth/context/auth-context";
import {
  ThemePreferenceProvider,
  useThemePreference,
} from "@/lib/theme-preference-context";

import "../globals.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemePreferenceProvider>
        <ThemedApp />
      </ThemePreferenceProvider>
    </GestureHandlerRootView>
  );
}

function ThemedApp() {
  const { effectiveScheme } = useThemePreference();

  return (
    <ThemeProvider value={effectiveScheme === "dark" ? DarkTheme : DefaultTheme}>
      <NativewindThemeProvider>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen
              name="auth/register"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="auth/forgot-password"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="auth/callback"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="incidents/new"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="incidents/[id]/edit"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </NativewindThemeProvider>
    </ThemeProvider>
  );
}
