import { ScreenSection } from "@/components/ui/screen";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
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

function SectionLabel({ label }: { label: string }) {
  return (
    <Text className="text-[11px] font-inter-semibold text-muted-foreground uppercase tracking-[0.8px] px-5">
      {label}
    </Text>
  );
}

export function IncidentsList({ incidents }: IncidentsListProps) {
  const router = useRouter();

  const open = incidents.filter((i) => i.status !== "resolved");
  const resolved = incidents.filter((i) => i.status === "resolved");

  return (
    <ScreenSection padded={false}>
      <View className="gap-6">
        <View className="gap-3">
          <SectionLabel label="Abiertas" />
          {open.length === 0 ? (
            <View className="mx-5 bg-muted rounded-sm px-4 py-5 items-center">
              <Text className="text-[13px] font-inter text-muted-foreground">
                No hay incidencias abiertas
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {open.map((incident) => (
                <IncidentListCard
                  key={incident.id}
                  {...incident}
                  onPress={() => router.push(`/incidents/${incident.id}` as any)}
                />
              ))}
            </View>
          )}
        </View>

        {resolved.length > 0 && (
          <View className="gap-3">
            <SectionLabel label="Resueltas" />
            <View className="gap-3">
              {resolved.map((incident) => (
                <IncidentListCard
                  key={incident.id}
                  {...incident}
                  onPress={() => router.push(`/incidents/${incident.id}` as any)}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </ScreenSection>
  );
}
