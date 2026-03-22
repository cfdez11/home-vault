import { ScreenSection } from "@/components/ui/screen";
import { View } from "react-native";
import type { PropertyType } from "../types";
import { PropertyListCard } from "./property-list-card";

export interface Property {
  id: string;
  name: string;
  year: string;
  address: string;
  imageBgColor: string;
  type?: PropertyType;
  featured?: boolean;
  incidents?: number;
  docsCount: number;
}

interface PropertiesListProps {
  properties: Property[];
}

export function PropertiesList({ properties }: PropertiesListProps) {
  return (
    <ScreenSection padded={false}>
      <View className="gap-4">
        {properties.map((property) => (
          <PropertyListCard key={property.id} {...property} />
        ))}
      </View>
    </ScreenSection>
  );
}
