import { AppHeader } from "@/components/app-header";
import { FabMenu } from "@/components/fab-menu";
import { Screen } from "@/components/ui/screen";
import { useState } from "react";
import { IncidentsEmptyList } from "../components/incidents-empty-list";
import { IncidentsFilterSheet } from "../components/incidents-filter-sheet";
import { IncidentsHeader } from "../components/incidents-header";
import { IncidentsList, type Incident } from "../components/incidents-list";
import { IncidentsSearch } from "../components/incidents-search";
import { DEFAULT_FILTERS, type IncidentFilters } from "../types";

// Demo data — replace with real data from Supabase
const DEMO_INCIDENTS: Incident[] = [
  {
    id: "1",
    title: "Fuga de agua en baño principal",
    description:
      "Se reporta humedad persistente en la pared colindante al pasillo. Requiere revisión de tubería y posible sustitución de sellado.",
    status: "open",
    priority: "high",
    date: "2023-10-12",
    cost: 150,
  },
  {
    id: "2",
    title: "Fallo eléctrico en cuadro general",
    description:
      "El diferencial salta con frecuencia al conectar electrodomésticos en la cocina. Posible sobrecarga en el circuito.",
    status: "in_progress",
    priority: "high",
    date: "2024-02-05",
    cost: null,
  },
  {
    id: "3",
    title: "Instalación LED salón",
    description:
      "Sustitución de iluminación halógena por LED en el salón principal. Incluye 8 puntos de luz.",
    status: "resolved",
    priority: "low",
    date: "2024-01-20",
    cost: 320,
  },
  {
    id: "4",
    title: "Revisión caldera anual",
    description:
      "Mantenimiento preventivo anual de la caldera de gas. Limpieza de quemadores y comprobación de presiones.",
    status: "resolved",
    priority: "medium",
    date: "2023-11-30",
    cost: 85,
  },
];

export default function IncidentsScreen() {
  const [search, setSearch] = useState("");
  const [fabExpanded, setFabExpanded] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState<IncidentFilters>(DEFAULT_FILTERS);

  const activeFilterCount =
    (filters.status !== null ? 1 : 0) + (filters.priority !== null ? 1 : 0);

  const filtered = DEMO_INCIDENTS.filter((i) => {
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
    >
      <IncidentsHeader />
      <IncidentsSearch
        value={search}
        onChangeText={setSearch}
        onOpenFilters={() => setFilterSheetOpen(true)}
        activeFilterCount={activeFilterCount}
      />
      {filtered.length > 0 ? (
        <IncidentsList incidents={filtered} />
      ) : (
        <IncidentsEmptyList />
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
