import { AppHeader } from "@/components/app-header";
import { Screen } from "@/components/ui/screen";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ScrollView } from "react-native";
import { CompanyForm } from "../components/company-form";
import type { CompanyFormValues } from "../schemas/company-schemas";

interface CompanyFormScreenProps {
  companyId?: string;
  defaultValues?: Partial<CompanyFormValues>;
}

export default function CompanyFormScreen({
  companyId,
  defaultValues,
}: CompanyFormScreenProps) {
  const router = useRouter();
  const isEditing = !!companyId;
  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: CompanyFormValues) {
    setIsSubmitting(true);
    try {
      // TODO: save to Supabase
      router.back();
    } finally {
      setIsSubmitting(false);
    }
  }

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
