import { AppHeader } from "@/components/app-header";
import { Screen } from "@/components/ui/screen";
import { useCreateIncident, useUpdateIncident } from "@/features/incidents/hooks/use-incidents";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { ScrollView } from "react-native";
import { toast } from "sonner-native";
import { IncidentForm } from "../components/incident-form";
import type { DocumentFormValues } from "@/features/properties/schemas/property-schemas";
import type { IncidentFormValues } from "../schemas/incident-schemas";

interface IncidentFormScreenProps {
  incidentId?: string;
  propertyId?: number;
  defaultValues?: Partial<IncidentFormValues>;
}

export default function IncidentFormScreen({
  incidentId,
  propertyId,
  defaultValues,
}: IncidentFormScreenProps) {
  const router = useRouter();
  const isEditing = !!incidentId;
  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const createIncident = useCreateIncident();
  const updateIncident = useUpdateIncident();

  const isSubmitting = createIncident.isPending || updateIncident.isPending;

  async function handleSubmit(
    values: IncidentFormValues,
    _documents: DocumentFormValues[],
    companyId: number | null,
  ) {
    if (isEditing) {
      const result = await updateIncident.mutateAsync({
        id: Number(incidentId),
        values: { ...values, companyId: companyId ?? undefined },
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Incidencia actualizada correctamente");
    } else {
      const result = await createIncident.mutateAsync({
        propertyId: values.propertyId!,
        companyId,
        values,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Incidencia creada correctamente");
    }
    router.back();
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
        initialPropertyId={propertyId}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        scrollViewRef={scrollViewRef}
      />
    </Screen>
  );
}
