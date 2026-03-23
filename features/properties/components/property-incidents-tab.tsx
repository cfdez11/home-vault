import { IncidentListCard } from "@/features/incidents/components/incident-list-card";
import type { IncidentStatus, PriorityLevel } from "@/features/incidents/types";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PropertyIncident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: PriorityLevel | null;
  date: string;
  cost: number | null;
  companyName?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <View className="mx-5 bg-muted rounded-sm px-4 py-5 items-center">
      <Text className="text-[13px] font-inter text-muted-foreground">{message}</Text>
    </View>
  );
}

// ─── PropertyIncidentsTab ─────────────────────────────────────────────────────

interface PropertyIncidentsTabProps {
  incidents: PropertyIncident[];
}

export function PropertyIncidentsTab({ incidents }: PropertyIncidentsTabProps) {
  const router = useRouter();

  const open = incidents.filter((i) => i.status !== "resolved");
  const resolved = incidents.filter((i) => i.status === "resolved");

  return (
    <View className="gap-6 pt-5 pb-2">
      {/* Open incidents */}
      <View className="gap-3">
        <Text className="text-[11px] font-inter-semibold text-muted-foreground uppercase tracking-[0.8px] px-5">
          Abiertas
        </Text>
        {open.length === 0 ? (
          <EmptyState message="No hay incidencias abiertas" />
        ) : (
          <View className="gap-3">
            {open.map((incident) => (
              <IncidentListCard
                key={incident.id}
                title={incident.title}
                description={incident.description}
                status={incident.status}
                priority={incident.priority}
                date={incident.date}
                cost={incident.cost}
                companyName={incident.companyName}
                onPress={() => router.push(`/incidents/${incident.id}` as any)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Resolved incidents */}
      {resolved.length > 0 && (
        <View className="gap-3">
          <Text className="text-[11px] font-inter-semibold text-muted-foreground uppercase tracking-[0.8px] px-5">
            Resueltas
          </Text>
          <View className="gap-3">
            {resolved.map((incident) => (
              <IncidentListCard
                key={incident.id}
                title={incident.title}
                description={incident.description}
                status={incident.status}
                priority={incident.priority}
                date={incident.date}
                cost={incident.cost}
                companyName={incident.companyName}
                onPress={() => router.push(`/incidents/${incident.id}` as any)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
