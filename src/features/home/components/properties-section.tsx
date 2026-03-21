import { Button } from "@/components/ui/button";
import { ScreenSection } from "@/components/ui/screen";
import { lightTokens } from "@/lib/theme-tokens";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { PropertyCard } from "./property-card";

const DEMO_PROPERTIES = [
  {
    id: "1",
    name: "Apartamento Centro",
    year: "2018",
    address: "Calle Mayor 12, 4B, Madrid",
    imageBgColor: lightTokens.primarySubtle,
    tagLabel: "Centro",
    incidents: 3,
    docsCount: 12,
  },
  {
    id: "2",
    name: "Casa Campo",
    year: "2021",
    address: "Camino Real s/n, Pedraza",
    imageBgColor: lightTokens.successSubtle,
    tagLabel: "Rural",
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
          onPress={() => router.navigate("/propiedades")}
        >
          Ver todas
        </Button>
      }
      padded={false}
    >
      <View className="gap-4">
        {DEMO_PROPERTIES.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </View>
    </ScreenSection>
  );
}
