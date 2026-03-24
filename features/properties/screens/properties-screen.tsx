import { AppHeader } from "@/components/app-header";
import { FabMenu } from "@/components/fab-menu";
import { Screen } from "@/components/ui/screen";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useRouter } from "expo-router";
import { useState } from "react";
import { PropertiesEmptyList } from "../components/properties-empty-list";
import { PropertiesFilterSheet } from "../components/properties-filter-sheet";
import { PropertiesHeader } from "../components/properties-header";
import { PropertiesList, type Property } from "../components/properties-list";
import { PropertiesSearch } from "../components/properties-search";
import { useProperties } from "../hooks/use-properties";
import { DEFAULT_FILTERS, type PropertyFilters } from "../types";

export default function PropertiesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [fabExpanded, setFabExpanded] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);

  const { data: currentUser } = useCurrentUser();
  const { data: rawProperties, isLoading, isFetching, refetch } = useProperties(currentUser?.id ?? null);

  const properties: Property[] = (rawProperties ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    type: p.type ?? undefined,
    incidents: p.incidentCount,
    docsCount: p.documentCount,
  }));

  const activeFilterCount =
    filters.types.length + (filters.incidentStatus !== null ? 1 : 0);

  const filtered = properties.filter((p) => {
    if (
      search !== "" &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.address.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (filters.types.length > 0 && p.type && !filters.types.includes(p.type)) {
      return false;
    }
    if (filters.incidentStatus === "none" && (p.incidents ?? 0) > 0) {
      return false;
    }
    if (filters.incidentStatus === "open" && (p.incidents ?? 0) === 0) {
      return false;
    }
    return true;
  });

  return (
    <Screen
      header={<AppHeader title="Historial de viviendas" />}
      fab={
        <FabMenu
          expanded={fabExpanded}
          onToggle={() => setFabExpanded(!fabExpanded)}
        />
      }
      onRefresh={refetch}
      refreshing={isFetching && !isLoading}
    >
      <PropertiesHeader />
      <PropertiesSearch
        value={search}
        onChangeText={setSearch}
        onOpenFilters={() => setFilterSheetOpen(true)}
        activeFilterCount={activeFilterCount}
      />
      {!isLoading && filtered.length === 0 ? (
        <PropertiesEmptyList onPress={() => router.push("/(tabs)/properties/new")} />
      ) : (
        <PropertiesList properties={filtered} />
      )}

      <PropertiesFilterSheet
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={filters}
        onChange={setFilters}
      />
    </Screen>
  );
}
