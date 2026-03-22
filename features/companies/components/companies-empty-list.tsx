import { Button } from "@/components/ui/button";
import { ScreenSection } from "@/components/ui/screen";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Building2 } from "lucide-react-native";
import { Text, View } from "react-native";

export function CompaniesEmptyList() {
  const colors = useThemeColors();

  return (
    <ScreenSection padded={false}>
      <View className="mx-5 rounded-lg bg-background items-center py-16 gap-6 border-dashed border-2 border-border">
        {/* Icon */}
        <View className="w-20 h-20 rounded-full bg-muted items-center justify-center">
          <Building2 size={32} color={colors.mutedForeground} />
        </View>

        {/* Text */}
        <View className="items-center gap-1.5">
          <Text className="text-[18px] font-manrope-bold text-foreground">
            Nueva Empresa
          </Text>
          <Text className="text-[13px] font-inter text-muted-foreground text-center">
            Añade tus proveedores y empresas de servicio
          </Text>
        </View>

        {/* CTA */}
        <Button>Añadir empresa</Button>
      </View>
    </ScreenSection>
  );
}
