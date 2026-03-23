import CompanyFormScreen from "@/features/companies/screens/company-form-screen";
import { useLocalSearchParams } from "expo-router";

export default function EditCompanyRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CompanyFormScreen companyId={id} />;
}
