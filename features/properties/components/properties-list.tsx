import { ScreenSection } from "@/components/ui/screen";
import { useRouter } from "expo-router";
import { View } from "react-native";
import type { PropertyType } from "../types";
import { PropertyListCard } from "./property-list-card";

export interface Property {
  id: number;
  name: string;
  address: string;
  type?: PropertyType | null;
  incidents?: number;
  docsCount: number;
}

interface PropertiesListProps {
  properties: Property[];
}

export function PropertiesList({ properties }: PropertiesListProps) {
  const router = useRouter();

  return (
    <ScreenSection padded={false}>
      <View className="gap-4">
        {properties.map((property) => (
          <PropertyListCard
            key={property.id}
            {...property}
            onPress={() => router.push(`/(tabs)/properties/${property.id}` as any)}
          />
        ))}
      </View>
    </ScreenSection>
  );
}
