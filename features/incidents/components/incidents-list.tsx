import { ScreenSection } from "@/components/ui/screen";
import { View } from "react-native";
import type { IncidentStatus, PriorityLevel } from "../types";
import { IncidentListCard } from "./incident-list-card";

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: PriorityLevel | null;
  date: string;
  cost: number | null;
}

interface IncidentsListProps {
  incidents: Incident[];
}

export function IncidentsList({ incidents }: IncidentsListProps) {
  return (
    <ScreenSection padded={false}>
      <View className="gap-4">
        {incidents.map((incident) => (
          <IncidentListCard key={incident.id} {...incident} />
        ))}
      </View>
    </ScreenSection>
  );
}
