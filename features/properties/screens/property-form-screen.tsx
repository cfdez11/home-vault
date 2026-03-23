import { AppHeader } from "@/components/app-header";
import { Screen } from "@/components/ui/screen";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ScrollView } from "react-native";
import { PropertyForm } from "../components/property-form";
import {
  type DocumentFormValues,
  type PropertyFormValues,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    values: PropertyFormValues,
    documents: DocumentFormValues[],
  ) {
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
