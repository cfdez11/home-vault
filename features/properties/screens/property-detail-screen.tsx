import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";
import { TabBar } from "@/components/ui/tab-bar";
import { usePropertyIncidents } from "@/features/incidents/hooks/use-incidents";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { PropertyDetailHero } from "../components/property-detail-hero";
import { PropertyDocumentsTab } from "../components/property-documents-tab";
import { PropertyIncidentsTab } from "../components/property-incidents-tab";
import { PropertyInfoTab } from "../components/property-info-tab";
import { useDocuments } from "../hooks/use-documents";
import { useProperty } from "../hooks/use-properties";

// ─── Tabs config ──────────────────────────────────────────────────────────────

type TabKey = "incidents" | "documents" | "info";

const TABS = [
  { key: "incidents" as TabKey, label: "Incidencias" },
  { key: "documents" as TabKey, label: "Documentos" },
  { key: "info" as TabKey, label: "Información" },
];

// ─── PropertyDetailScreen ─────────────────────────────────────────────────────

interface PropertyDetailScreenProps {
  propertyId: number;
}

export default function PropertyDetailScreen({
  propertyId,
}: PropertyDetailScreenProps) {
  const colors = useThemeColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("incidents");

  const { data: property, isLoading: isLoadingProperty } =
    useProperty(propertyId);
  const { data: incidents = [], isLoading: isLoadingIncidents } =
    usePropertyIncidents(propertyId);
  const { data: documents = [], isLoading: isLoadingDocuments } =
    useDocuments(propertyId);

  if (isLoadingProperty) {
    return (
      <Screen header={<AppHeader title="" showBack />}>
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!property) return null;

  const mappedIncidents =
    incidents?.map((i) => ({
      id: String(i.id),
      title: i.title,
      description: i.description,
      status: i.status,
      priority: i.priority ?? null,
      date: i.date,
      cost: i.cost ?? null,
      companyName: i.company ?? null,
    })) ?? [];

  const mappedDocuments =
    documents?.map((d) => ({
      id: String(d.id),
      title: d.title,
      type: d.type,
      date: d.date ?? "",
      url: d.url,
      notes: d.notes,
    })) ?? [];

  return (
    <Screen
      header={
        <AppHeader
          title={property.name}
          showBack
          rightAction={
            <Button
              unstyled
              onPress={() =>
                router.push(`/(tabs)/properties/${propertyId}/edit` as any)
              }
              className="w-8 h-8 items-center justify-center"
            >
              <Pencil size={20} color={colors.primary} />
            </Button>
          }
        />
      }
    >
      <PropertyDetailHero
        name={property.name}
        address={property.address}
        type={property.type ?? null}
      />

      <TabBar
        tabs={TABS}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
      />

      {activeTab === "incidents" && (
        <PropertyIncidentsTab
          propertyId={propertyId}
          incidents={mappedIncidents}
          isLoading={isLoadingIncidents}
        />
      )}
      {activeTab === "documents" && (
        <PropertyDocumentsTab
          documents={mappedDocuments}
          isLoading={isLoadingDocuments}
        />
      )}
      {activeTab === "info" && (
        <PropertyInfoTab
          type={property.type ?? null}
          size={property.size ?? null}
          year={property.year ?? null}
          documentCount={mappedDocuments.length}
          incidentCount={mappedIncidents.length}
        />
      )}
    </Screen>
  );
}
