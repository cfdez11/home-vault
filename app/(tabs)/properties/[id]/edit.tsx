import PropertyFormScreen from "@/features/properties/screens/property-form-screen";
import { useLocalSearchParams } from "expo-router";

export default function PropertyEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: fetch property by id from Supabase and pass defaultValues
  return <PropertyFormScreen propertyId={id} />;
}
