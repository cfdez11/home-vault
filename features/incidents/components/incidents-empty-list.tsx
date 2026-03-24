import { Button } from "@/components/ui/button";
import { ScreenSection } from "@/components/ui/screen";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { ClipboardList } from "lucide-react-native";
import { Text, View } from "react-native";

interface IncidentsEmptyListProps {
  onPress?: () => void;
}

export function IncidentsEmptyList({ onPress }: IncidentsEmptyListProps) {
  const colors = useThemeColors();

  return (
    <ScreenSection padded={false}>
      <View className="mx-5 rounded-lg bg-background items-center py-16 gap-6 border-dashed border-2 border-border">
        <View className="w-20 h-20 rounded-full bg-muted items-center justify-center">
          <ClipboardList size={32} color={colors.mutedForeground} />
        </View>

        <View className="items-center gap-1.5">
          <Text className="text-[18px] font-manrope-bold text-foreground">
            Sin incidencias
          </Text>
          <Text className="text-[13px] font-inter text-muted-foreground text-center">
            No se han encontrado incidencias
          </Text>
        </View>

        <Button onPress={onPress}>Añadir incidencia</Button>
      </View>
    </ScreenSection>
  );
}
