import IncidentFormScreen from "@/features/incidents/screens/incident-form-screen";
import { useLocalSearchParams } from "expo-router";
export default function EditIncidentRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <IncidentFormScreen incidentId={id} />;
}
