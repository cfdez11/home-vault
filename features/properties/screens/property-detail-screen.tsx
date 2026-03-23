import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";
import { TabBar } from "@/components/ui/tab-bar";
import type { IncidentStatus, PriorityLevel } from "@/features/incidents/types";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { PropertyDetailHero } from "../components/property-detail-hero";
import { PropertyDocumentsTab } from "../components/property-documents-tab";
import { PropertyIncidentsTab } from "../components/property-incidents-tab";
import { PropertyInfoTab } from "../components/property-info-tab";
import type { PropertyType } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PropertyDocument {
  id: string;
  title: string;
  type: string;
  date: string;
  url?: string | null;
  notes?: string | null;
}

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

export interface PropertyDetail {
  id: string;
  name: string;
  address: string;
  type: PropertyType | null;
  size: number | null;
  year: number | null;
  documents: PropertyDocument[];
  incidents: PropertyIncident[];
}

// ─── Tabs config ──────────────────────────────────────────────────────────────

type TabKey = "incidents" | "documents" | "info";

// ─── PropertyDetailScreen ─────────────────────────────────────────────────────

interface PropertyDetailScreenProps {
  property: PropertyDetail;
}

export default function PropertyDetailScreen({ property }: PropertyDetailScreenProps) {
  const colors = useThemeColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("incidents");

  const tabs = [
    { key: "incidents" as TabKey, label: "Incidencias" },
    { key: "documents" as TabKey, label: "Documentos" },
    { key: "info" as TabKey, label: "Información" },
  ];

  return (
    <Screen
      header={
        <AppHeader
          title={property.name}
          showBack
          rightAction={
            <Button
              unstyled
              onPress={() => router.push(`/(tabs)/properties/${property.id}/edit` as any)}
              className="w-8 h-8 items-center justify-center"
            >
              <Pencil size={20} color={colors.primary} />
            </Button>
          }
        />
      }
    >
      {/* Hero */}
      <PropertyDetailHero
        name={property.name}
        address={property.address}
        type={property.type}
      />

      {/* In-page tab bar */}
      <TabBar
        tabs={tabs}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
      />

      {/* Tab content */}
      {activeTab === "incidents" && (
        <PropertyIncidentsTab incidents={property.incidents} />
      )}
      {activeTab === "documents" && (
        <PropertyDocumentsTab documents={property.documents} />
      )}
      {activeTab === "info" && (
        <PropertyInfoTab
          type={property.type}
          size={property.size}
          year={property.year}
          documentCount={property.documents.length}
          incidentCount={property.incidents.length}
        />
      )}
    </Screen>
  );
}
