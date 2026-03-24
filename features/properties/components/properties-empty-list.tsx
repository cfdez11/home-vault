import { Button } from "@/components/ui/button";
import { ScreenSection } from "@/components/ui/screen";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { HousePlus } from "lucide-react-native";
import { Text, View } from "react-native";

interface PropertiesEmptyListProps {
  onPress?: () => void;
}

export function PropertiesEmptyList({ onPress }: PropertiesEmptyListProps) {
  const colors = useThemeColors();

  return (
    <ScreenSection padded={false}>
      <View className="mx-5 rounded-lg bg-background items-center py-16 gap-6 border-dashed border-2 border-border">
        <View className="w-20 h-20 rounded-full bg-muted items-center justify-center">
          <HousePlus size={32} color={colors.mutedForeground} />
        </View>

        <View className="items-center gap-1.5">
          <Text className="text-[18px] font-manrope-bold text-foreground">
            Sin propiedades
          </Text>
          <Text className="text-[13px] font-inter text-muted-foreground text-center">
            No se han encontrado propiedades
          </Text>
        </View>

        <Button onPress={onPress}>Añadir propiedad</Button>
      </View>
    </ScreenSection>
  );
}
