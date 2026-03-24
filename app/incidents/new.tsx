import IncidentFormScreen from "@/features/incidents/screens/incident-form-screen";
import { useLocalSearchParams } from "expo-router";

export default function NewIncidentRoute() {
  const { propertyId } = useLocalSearchParams<{ propertyId?: string }>();
  return <IncidentFormScreen propertyId={propertyId ? Number(propertyId) : undefined} />;
}
