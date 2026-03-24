import { AppHeader } from "@/components/app-header";
import { FabMenu } from "@/components/fab-menu";
import { Screen } from "@/components/ui/screen";
import { useRouter } from "expo-router";
import { useState } from "react";
import { CompaniesEmptyList } from "../components/companies-empty-list";
import { CompaniesFilterSheet } from "../components/companies-filter-sheet";
import { CompaniesHeader } from "../components/companies-header";
import { CompaniesList, type Company } from "../components/companies-list";
import { CompaniesSearch } from "../components/companies-search";
import { useCompanies } from "../hooks/use-companies";
import { DEFAULT_FILTERS, type CompanyFilters } from "../types";

export default function CompaniesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [fabExpanded, setFabExpanded] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filters, setFilters] = useState<CompanyFilters>(DEFAULT_FILTERS);

  const { data: rawCompanies, isLoading, isFetching, refetch } = useCompanies();

  const companies: Company[] = (rawCompanies ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    categories: c.categories,
    phone: c.phone,
    email: c.email,
    pendingIncidents: c.pendingIncidents,
    recentIncidents: c.recentIncidents,
  }));

  const activeFilterCount =
    filters.categories.length + (filters.incidentStatus !== null ? 1 : 0);

  const filtered = companies.filter((c) => {
    if (
      search !== "" &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.categories.some((cat) =>
        cat.toLowerCase().includes(search.toLowerCase())
      )
    ) {
      return false;
    }
    if (
      filters.categories.length > 0 &&
      !filters.categories.some((f) => c.categories.includes(f))
    ) {
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
      onRefresh={refetch}
      refreshing={isFetching && !isLoading}
    >
      <CompaniesHeader />
      <CompaniesSearch
        value={search}
        onChangeText={setSearch}
        onOpenFilters={() => setFilterSheetOpen(true)}
        activeFilterCount={activeFilterCount}
      />
      {!isLoading && filtered.length === 0 ? (
        <CompaniesEmptyList onPress={() => router.push("/companies/new")} />
      ) : (
        <CompaniesList companies={filtered} />
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
