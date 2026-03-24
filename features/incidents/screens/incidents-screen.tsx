import { AppHeader } from "@/components/app-header";
import { FabMenu } from "@/components/fab-menu";
import { Screen } from "@/components/ui/screen";
import { useRouter } from "expo-router";
import { useState } from "react";
import { IncidentsEmptyList } from "../components/incidents-empty-list";
import { IncidentsFilterSheet } from "../components/incidents-filter-sheet";
import { IncidentsHeader } from "../components/incidents-header";
import { IncidentsList, type Incident } from "../components/incidents-list";
import { IncidentsSearch } from "../components/incidents-search";
import { useIncidents } from "../hooks/use-incidents";
import { DEFAULT_FILTERS, type IncidentFilters } from "../types";

export default function IncidentsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [fabExpanded, setFabExpanded] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState<IncidentFilters>(DEFAULT_FILTERS);

  const { data: rawIncidents, isLoading, isFetching, refetch } = useIncidents();

  const incidents: Incident[] = (rawIncidents ?? []).map((i) => ({
    id: i.id,
    title: i.title,
    description: i.description,
    status: i.status,
    priority: i.priority ?? null,
    date: i.date,
    cost: i.cost ?? null,
  }));

  const activeFilterCount =
    (filters.status !== null ? 1 : 0) + (filters.priority !== null ? 1 : 0);

  const filtered = incidents.filter((i) => {
    if (
      search !== "" &&
      !i.title.toLowerCase().includes(search.toLowerCase()) &&
      !i.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (filters.status !== null && i.status !== filters.status) {
      return false;
    }
    if (filters.priority !== null && i.priority !== filters.priority) {
      return false;
    }
    return true;
  });

  return (
    <Screen
      header={<AppHeader title="Incidencias" />}
      fab={
        <FabMenu
          expanded={fabExpanded}
          onToggle={() => setFabExpanded(!fabExpanded)}
        />
      }
      onRefresh={refetch}
      refreshing={isFetching && !isLoading}
    >
      <IncidentsHeader />
      <IncidentsSearch
        value={search}
        onChangeText={setSearch}
        onOpenFilters={() => setFilterSheetOpen(true)}
        activeFilterCount={activeFilterCount}
      />
      {!isLoading && filtered.length === 0 ? (
        <IncidentsEmptyList onPress={() => router.push("/incidents/new")} />
      ) : (
        <IncidentsList incidents={filtered} />
      )}

      <IncidentsFilterSheet
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={filters}
        onChange={setFilters}
      />
    </Screen>
  );
}
