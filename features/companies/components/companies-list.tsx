import { ScreenSection } from "@/components/ui/screen";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { CompanyListCard, type RecentIncident } from "./company-list-card";

export interface Company {
  id: number;
  name: string;
  categories: string[];
  phone: string | null;
  email: string | null;
  pendingIncidents: number;
  recentIncidents: RecentIncident[];
}

interface CompaniesListProps {
  companies: Company[];
}

export function CompaniesList({ companies }: CompaniesListProps) {
  const router = useRouter();

  return (
    <ScreenSection padded={false}>
      <View className="gap-4">
        {companies.map((company) => (
          <CompanyListCard
            key={company.id}
            {...company}
            onPress={() => router.push(`/companies/${company.id}` as any)}
          />
        ))}
      </View>
    </ScreenSection>
  );
}
