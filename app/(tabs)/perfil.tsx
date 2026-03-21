import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { LogOut } from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const colors = useThemeColors();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader title="Perfil" />
      <View className="px-6 pb-8">
        <Button variant="outline" size="lg" onPress={signOut}>
          <View className="flex-row items-center gap-2">
            <LogOut size={18} color={colors.destructive} />
            <Text className="text-base font-inter-semibold text-destructive">
              Cerrar sesión
            </Text>
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
}
