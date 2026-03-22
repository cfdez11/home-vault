import { AppHeader } from "@/components/app-header";
import { Screen } from "@/components/ui/screen";
import { Text, View } from "react-native";

export default function IncidenciasScreen() {
  return (
    <Screen header={<AppHeader title="Incidencias" />}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-sm font-inter text-muted-foreground mt-2">
          Próximamente
        </Text>
      </View>
    </Screen>
  );
}
