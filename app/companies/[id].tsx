import CompanyDetailScreen from "@/features/companies/screens/company-detail-screen";
import { useLocalSearchParams } from "expo-router";

export default function CompanyDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CompanyDetailScreen companyId={Number(id)} />;
}
