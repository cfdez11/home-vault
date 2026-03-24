import PropertyDetailScreen from "@/features/properties/screens/property-detail-screen";
import { useLocalSearchParams } from "expo-router";

export default function PropertyDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PropertyDetailScreen propertyId={Number(id)} />;
}
