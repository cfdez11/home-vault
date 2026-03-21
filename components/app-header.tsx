import { useThemeColors } from "@/hooks/use-theme-colors";
import { Bell } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface AppHeaderProps {
  title: string;
  onNotificationPress?: () => void;
}

export function AppHeader({ title, onNotificationPress }: AppHeaderProps) {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center px-5 py-4 bg-background">
      <Text
        className="flex-1 text-[18px] font-manrope-bold text-primary"
        numberOfLines={1}
      >
        {title}
      </Text>

      <TouchableOpacity onPress={onNotificationPress} className="ml-3">
        <Bell size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}
