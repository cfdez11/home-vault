import { Button } from "@/components/ui/button";
import { ScreenSection } from "@/components/ui/screen";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { PropertiesEmptyList } from "@/features/properties/components/properties-empty-list";
import { useProperties } from "@/features/properties/hooks/use-properties";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { PropertyCard } from "./property-card";

export function PropertiesSection() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { data: properties, isLoading } = useProperties(currentUser?.id ?? null);

  const preview = (properties ?? []).slice(0, 3);
  const hasProperties = preview.length > 0;

  return (
    <ScreenSection
      title="Tus Propiedades"
      action={
        hasProperties ? (
          <Button
            variant="link"
            size="sm"
            onPress={() => router.navigate("/(tabs)/properties")}
          >
            Ver todas
          </Button>
        ) : undefined
      }
      padded={false}
    >
      {!isLoading && !hasProperties ? (
        <PropertiesEmptyList
          onPress={() => router.push("/(tabs)/properties/new")}
        />
      ) : (
        <View className="gap-4">
          {preview.map((property) => (
            <PropertyCard
              key={property.id}
              name={property.name}
              address={property.address}
              incidents={property.incidentCount}
              docsCount={property.documentCount}
              onPress={() =>
                router.push(`/(tabs)/properties/${property.id}` as any)
              }
            />
          ))}
        </View>
      )}
    </ScreenSection>
  );
}
