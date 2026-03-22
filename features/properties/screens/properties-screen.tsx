import { AppHeader } from "@/components/app-header";
import { FabMenu } from "@/components/fab-menu";
import { Screen } from "@/components/ui/screen";
import { lightTokens } from "@/lib/theme-tokens";
import { useState } from "react";
import { PropertiesEmptyList } from "../components/properties-empty-list";
import { PropertiesFilterSheet } from "../components/properties-filter-sheet";
import { PropertiesHeader } from "../components/properties-header";
import { PropertiesList, type Property } from "../components/properties-list";
import { PropertiesSearch } from "../components/properties-search";
import { DEFAULT_FILTERS, type PropertyFilters } from "../types";

// Demo data — replace with real data from Supabase
const DEMO_PROPERTIES: Property[] = [
  {
    id: "1",
    name: "Apartamento Centro",
    year: "2019",
    address: "Calle Mayor 14, 28013 Madrid",
    imageBgColor: lightTokens.primarySubtle,
    type: "apartment",
    featured: true,
    incidents: 2,
    docsCount: 12,
  },
  {
    id: "2",
    name: "Casa Campo",
    year: "2021",
    address: "Carretera de Soria km 12, Segovia",
    imageBgColor: lightTokens.successSubtle,
    type: "house",
    featured: false,
    incidents: 0,
    docsCount: 5,
  },
  {
    id: "3",
    name: "Ático Retiro",
    year: "2023",
    address: "Avenida de Menéndez Pelayo, Madrid",
    imageBgColor: lightTokens.accentSubtle,
    type: "apartment",
    featured: false,
    incidents: 1,
    docsCount: 8,
  },
];

export default function PropertiesScreen() {
  const [search, setSearch] = useState("");
  const [fabExpanded, setFabExpanded] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);

  const activeFilterCount =
    filters.types.length + (filters.incidentStatus !== null ? 1 : 0);

  const filtered = DEMO_PROPERTIES.filter((p) => {
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
    >
      <PropertiesHeader />
      <PropertiesSearch
        value={search}
        onChangeText={setSearch}
        onOpenFilters={() => setFilterSheetOpen(true)}
        activeFilterCount={activeFilterCount}
      />
      {filtered.length > 0 ? (
        <PropertiesList properties={filtered} />
      ) : (
        <PropertiesEmptyList />
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
