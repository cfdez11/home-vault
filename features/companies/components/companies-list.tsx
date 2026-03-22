import { ScreenSection } from "@/components/ui/screen";
import { View } from "react-native";
import type { CompanyCategory } from "../types";
import { CompanyListCard, type RecentIncident } from "./company-list-card";

export interface Company {
  id: string;
  name: string;
  category: CompanyCategory;
  phone: string;
  email: string;
  pendingIncidents: number;
  recentIncidents: RecentIncident[];
}

interface CompaniesListProps {
  companies: Company[];
}

export function CompaniesList({ companies }: CompaniesListProps) {
  return (
    <ScreenSection padded={false}>
      <View className="gap-4">
        {companies.map((company) => (
          <CompanyListCard key={company.id} {...company} />
        ))}
      </View>
    </ScreenSection>
  );
}
