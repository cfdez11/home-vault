import { Button } from "@/components/ui/button";
import { ScreenSection } from "@/components/ui/screen";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { PropertyCard } from "./property-card";

const DEMO_PROPERTIES = [
  {
    id: "1",
    name: "Apartamento Centro",
    address: "Calle Mayor 12, 4B, Madrid",
    incidents: 3,
    docsCount: 12,
  },
  {
    id: "2",
    name: "Casa Campo",
    address: "Camino Real s/n, Pedraza",
    incidents: 0,
    docsCount: 8,
  },
];

export function PropertiesSection() {
  const router = useRouter();

  return (
    <ScreenSection
      title="Tus Propiedades"
      action={
        <Button
          variant="link"
          size="sm"
          onPress={() => router.navigate("/(tabs)/properties")}
        >
          Ver todas
        </Button>
      }
      padded={false}
    >
      <View className="gap-4">
        {DEMO_PROPERTIES.map((property) => (
          <PropertyCard
            key={property.id}
            {...property}
            onPress={() => router.push(`/(tabs)/properties/${property.id}` as any)}
          />
        ))}
      </View>
    </ScreenSection>
  );
}
