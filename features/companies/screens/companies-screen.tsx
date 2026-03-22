import { AppHeader } from "@/components/app-header";
import { FabMenu } from "@/components/fab-menu";
import { Screen } from "@/components/ui/screen";
import { useState } from "react";
import { CompaniesEmptyList } from "../components/companies-empty-list";
import { CompaniesFilterSheet } from "../components/companies-filter-sheet";
import { CompaniesHeader } from "../components/companies-header";
import { CompaniesList, type Company } from "../components/companies-list";
import { CompaniesSearch } from "../components/companies-search";
import { DEFAULT_FILTERS, type CompanyFilters } from "../types";

// Demo data — replace with real data from Supabase
const DEMO_COMPANIES: Company[] = [
  {
    id: "1",
    name: "Voltio Express S.L.",
    category: "electricista",
    phone: "+34 612 345 678",
    email: "contacto@voltioexpress.com",
    pendingIncidents: 2,
    recentIncidents: [
      { id: "i1", title: "Fallo térmico cuadro general", status: "open" },
      { id: "i2", title: "Instalación LED cocina", status: "resolved" },
    ],
  },
  {
    id: "2",
    name: "AquaFix Fontanería",
    category: "fontanero",
    phone: "+34 634 987 321",
    email: "info@aquafix.es",
    pendingIncidents: 0,
    recentIncidents: [
      { id: "i3", title: "Reparación grifo cocina", status: "resolved" },
      { id: "i4", title: "Revisión caldera anual", status: "resolved" },
    ],
  },
  {
    id: "3",
    name: "ClimaPro S.A.",
    category: "climatizacion",
    phone: "+34 658 111 222",
    email: "soporte@climapro.es",
    pendingIncidents: 1,
    recentIncidents: [
      { id: "i5", title: "Revisión filtros split salón", status: "in_progress" },
    ],
  },
];

export default function CompaniesScreen() {
  const [search, setSearch] = useState("");
  const [fabExpanded, setFabExpanded] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState<CompanyFilters>(DEFAULT_FILTERS);

  const activeFilterCount =
    filters.categories.length + (filters.incidentStatus !== null ? 1 : 0);

  const filtered = DEMO_COMPANIES.filter((c) => {
    if (
      search !== "" &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.category.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (filters.categories.length > 0 && !filters.categories.includes(c.category)) {
      return false;
    }
    if (filters.incidentStatus === "none" && c.pendingIncidents > 0) {
      return false;
    }
    if (filters.incidentStatus === "open" && c.pendingIncidents === 0) {
      return false;
    }
    return true;
  });

  return (
    <Screen
      header={<AppHeader title="Empresas" />}
      fab={
        <FabMenu
          expanded={fabExpanded}
          onToggle={() => setFabExpanded(!fabExpanded)}
        />
      }
    >
      <CompaniesHeader />
      <CompaniesSearch
        value={search}
        onChangeText={setSearch}
        onOpenFilters={() => setFilterSheetOpen(true)}
        activeFilterCount={activeFilterCount}
      />
      {filtered.length > 0 ? (
        <CompaniesList companies={filtered} />
      ) : (
        <CompaniesEmptyList />
      )}

      <CompaniesFilterSheet
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={filters}
        onChange={setFilters}
      />
    </Screen>
  );
}
