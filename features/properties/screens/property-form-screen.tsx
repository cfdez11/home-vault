import { AppHeader } from "@/components/app-header";
import { Screen } from "@/components/ui/screen";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { ScrollView } from "react-native";
import { toast } from "sonner-native";
import { PropertyForm } from "../components/property-form";
import { useCreateProperty, useUpdateProperty } from "../hooks/use-properties";
import type {
  DocumentFormValues,
  PropertyFormValues,
} from "../schemas/property-schemas";

interface PropertyFormScreenProps {
  propertyId?: string;
  defaultValues?: Partial<PropertyFormValues>;
}

export default function PropertyFormScreen({
  propertyId,
  defaultValues,
}: PropertyFormScreenProps) {
  const router = useRouter();
  const isEditing = !!propertyId;
  const scrollViewRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const createProperty = useCreateProperty(currentUser?.id ?? 0);
  const updateProperty = useUpdateProperty(currentUser?.id ?? 0);

  const isSubmitting =
    createProperty.isPending || updateProperty.isPending || isLoadingUser;

  async function handleSubmit(
    values: PropertyFormValues,
    _documents: DocumentFormValues[],
  ) {
    if (isEditing) {
      const result = await updateProperty.mutateAsync({
        id: Number(propertyId),
        values,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Propiedad actualizada correctamente");
    } else {
      const result = await createProperty.mutateAsync(values);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Propiedad creada correctamente");
    }
    router.back();
  }

  return (
    <Screen
      header={
        <AppHeader
          title={isEditing ? "Editar Propiedad" : "Nueva Propiedad"}
          showBack
        />
      }
      keyboardAvoiding
      scrollViewRef={scrollViewRef}
    >
      <PropertyForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        scrollViewRef={scrollViewRef}
      />
    </Screen>
  );
}
