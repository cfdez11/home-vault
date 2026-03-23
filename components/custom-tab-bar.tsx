import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/utils";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import {
  Briefcase,
  Building2,
  ClipboardList,
  LayoutDashboard,
  LucideIcon,
} from "lucide-react-native";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabConfig = {
  name: string;
  href: string;
  label: string;
  icon: LucideIcon;
};

const TABS: TabConfig[] = [
  { name: "index", href: "/(tabs)/", label: "Inicio", icon: LayoutDashboard },
  { name: "properties", href: "/(tabs)/properties", label: "Propiedades", icon: Building2 },
  { name: "companies", href: "/(tabs)/companies", label: "Empresas", icon: Briefcase },
  { name: "incidents", href: "/(tabs)/incidents", label: "Incidencias", icon: ClipboardList },
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 rounded-tl-[32px] rounded-tr-[32px] shadow-lg"
      style={{
        paddingBottom: insets.bottom,
        backgroundColor:
          Platform.OS === "android" ? `${colors.card}F5` : `${colors.card}EB`,
      }}
    >
      <View className="flex-row justify-around items-center h-[72px] px-4">
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;
          const Icon = tab.icon;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: state.routes[index]?.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              // router.navigate unwinds any nested stack back to the index screen,
              // whereas navigation.navigate preserves the nested stack state.
              router.navigate(tab.href as any);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={onPress}
              activeOpacity={0.8}
              className={cn(
                "flex-1 items-center justify-center px-3 py-2 rounded-2xl gap-[3px]",
                isFocused && "bg-primary"
              )}
            >
              <Icon
                size={22}
                color={
                  isFocused ? colors.primaryForeground : colors.mutedForeground
                }
              />
              <Text
                className={cn(
                  "text-[9px] font-semibold uppercase tracking-[0.8px]",
                  isFocused ? "text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
