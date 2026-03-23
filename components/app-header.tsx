import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useRouter } from "expo-router";
import { ArrowLeft, Settings } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function AppHeader({
  title,
  showBack = false,
  rightAction,
}: AppHeaderProps) {
  const colors = useThemeColors();
  const router = useRouter();

  if (showBack) {
    return (
      <View className="flex-row items-center px-5 py-4 bg-background gap-3">
        <Button unstyled onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.primary} />
        </Button>
        <Text
          className="flex-1 text-[18px] font-manrope-bold text-primary"
          numberOfLines={1}
        >
          {title}
        </Text>
        {rightAction}
      </View>
    );
  }

  return (
    <View className="flex-row items-center px-5 py-4 bg-background gap-3">
      <Text
        className="flex-1 text-[18px] font-manrope-bold text-primary"
        numberOfLines={1}
      >
        {title}
      </Text>

      <Button unstyled onPress={() => router.push("/(tabs)/profile")}>
        <Settings size={24} color={colors.primary} />
      </Button>
    </View>
  );
}
