import { IncidentListCard } from "@/features/incidents/components/incident-list-card";
import { IncidentsEmptyList } from "@/features/incidents/components/incidents-empty-list";
import type { IncidentStatus, PriorityLevel } from "@/features/incidents/types";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useRouter } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

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

function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="text-[11px] font-inter-semibold text-muted-foreground uppercase tracking-[0.8px] px-5">
      {children}
    </Text>
  );
}

// ─── PropertyIncidentsTab ─────────────────────────────────────────────────────

interface PropertyIncidentsTabProps {
  propertyId: number;
  incidents: PropertyIncident[];
  isLoading?: boolean;
}

export function PropertyIncidentsTab({ propertyId, incidents, isLoading }: PropertyIncidentsTabProps) {
  const router = useRouter();
  const colors = useThemeColors();

  if (isLoading) {
    return (
      <View className="pt-10 items-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (incidents.length === 0) {
    return (
      <IncidentsEmptyList
        onPress={() => router.push(`/incidents/new?propertyId=${propertyId}` as any)}
      />
    );
  }

  const open = incidents.filter((i) => i.status !== "resolved");
  const resolved = incidents.filter((i) => i.status === "resolved");

  return (
    <View className="gap-6 pt-5 pb-2">
      <View className="gap-3">
        <SectionLabel>Abiertas</SectionLabel>
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

      {resolved.length > 0 && (
        <View className="gap-3">
          <SectionLabel>Resueltas</SectionLabel>
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
