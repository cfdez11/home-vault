import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useRouter } from "expo-router";
import { Bell, Settings } from "lucide-react-native";
import { Text, View } from "react-native";

interface AppHeaderProps {
  title: string;
  onNotificationPress?: () => void;
}

export function AppHeader({ title, onNotificationPress }: AppHeaderProps) {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <View className="flex-row items-center px-5 py-4 bg-background gap-3">
      <Text
        className="flex-1 text-[18px] font-manrope-bold text-primary"
        numberOfLines={1}
      >
        {title}
      </Text>

      <Button unstyled onPress={onNotificationPress}>
        <Bell size={24} color={colors.primary} />
      </Button>
      <Button unstyled onPress={() => router.push("/(tabs)/perfil")}>
        <Settings size={24} color={colors.primary} />
      </Button>
    </View>
  );
}
