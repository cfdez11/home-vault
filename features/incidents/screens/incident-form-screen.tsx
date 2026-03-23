import { AppHeader } from "@/components/app-header";
import { Screen } from "@/components/ui/screen";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ScrollView } from "react-native";
import { IncidentForm } from "../components/incident-form";
import type { DocumentFormValues } from "@/features/properties/schemas/property-schemas";
import type { IncidentFormValues } from "../schemas/incident-schemas";

interface IncidentFormScreenProps {
  incidentId?: string;
  defaultValues?: Partial<IncidentFormValues>;
}

export default function IncidentFormScreen({
  incidentId,
  defaultValues,
}: IncidentFormScreenProps) {
  const router = useRouter();
  const isEditing = !!incidentId;
  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: IncidentFormValues, documents: DocumentFormValues[]) {
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
          title={isEditing ? "Editar Incidencia" : "Nueva Incidencia"}
          showBack
        />
      }
      keyboardAvoiding
      scrollViewRef={scrollViewRef}
    >
      <IncidentForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        scrollViewRef={scrollViewRef}
      />
    </Screen>
  );
}
