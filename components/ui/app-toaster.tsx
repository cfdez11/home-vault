import { useThemeColors } from "@/hooks/use-theme-colors";
import { Toaster } from "sonner-native";

export function AppToaster() {
  const colors = useThemeColors();

  return (
    <Toaster
      position="top-center"
      duration={2500}
      toastOptions={{
        style: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          gap: 10,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        },
        titleStyle: {
          color: colors.foreground,
          fontFamily: "Inter_500Medium",
          fontSize: 14,
        },
        descriptionStyle: {
          color: colors.mutedForeground,
          fontFamily: "Inter_400Regular",
          fontSize: 13,
        },
      }}
    />
  );
}
