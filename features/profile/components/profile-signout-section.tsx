import { Button } from "@/components/ui/button";
import { ScreenSection } from "@/components/ui/screen";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { LogOut } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface ProfileSignOutSectionProps {
  onSignOut: () => void;
}

export function ProfileSignOutSection({ onSignOut }: ProfileSignOutSectionProps) {
  const colors = useThemeColors();

  return (
    <ScreenSection>
      <Button variant="outline" size="lg" onPress={onSignOut}>
        <View className="flex-row items-center gap-2">
          <LogOut size={18} color={colors.destructive} />
          <Text className="text-base font-inter-semibold text-destructive">
            Cerrar sesión
          </Text>
        </View>
      </Button>
    </ScreenSection>
  );
}
