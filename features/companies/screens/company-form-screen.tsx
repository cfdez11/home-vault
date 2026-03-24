import { AppHeader } from "@/components/app-header";
import { Screen } from "@/components/ui/screen";
import {
  useCompany,
  useCreateCompany,
  useUpdateCompany,
} from "@/features/companies/hooks/use-companies";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { toast } from "sonner-native";
import { CompanyForm } from "../components/company-form";
import type { CompanyFormValues } from "../schemas/company-schemas";

interface CompanyFormScreenProps {
  companyId?: string;
}

export default function CompanyFormScreen({
  companyId,
}: CompanyFormScreenProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const isEditing = !!companyId;
  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const { data: company, isLoading } = useCompany(
    isEditing ? Number(companyId) : null,
  );
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();

  const isSubmitting = createCompany.isPending || updateCompany.isPending;

  async function handleSubmit(values: CompanyFormValues) {
    if (isEditing) {
      const result = await updateCompany.mutateAsync({
        id: Number(companyId),
        values,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Empresa actualizada correctamente");
    } else {
      const result = await createCompany.mutateAsync(values);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Empresa creada correctamente");
    }
    router.back();
  }

  if (isEditing && isLoading) {
    return (
      <Screen header={<AppHeader title="Editar Empresa" showBack />}>
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  const defaultValues: Partial<CompanyFormValues> | undefined = company
    ? {
        name: company.name,
        phone: company.phone ?? "",
        email: company.email ?? "",
      }
    : undefined;

  return (
    <Screen
      header={
        <AppHeader
          title={isEditing ? "Editar Empresa" : "Nueva Empresa"}
          showBack
        />
      }
      keyboardAvoiding
      scrollViewRef={scrollViewRef}
    >
      <CompanyForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        scrollViewRef={scrollViewRef}
      />
    </Screen>
  );
}
