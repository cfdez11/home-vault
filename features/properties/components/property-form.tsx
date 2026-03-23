import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, MapPin, Plus, Trash2 } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import {
  type DocumentFormValues,
  type PropertyFormValues,
  propertySchema,
} from "../schemas/property-schemas";
import { AddDocumentSheet } from "./add-document-sheet";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROPERTY_TYPE_OPTIONS = [
  { value: "apartment", label: "Apartamento" },
  { value: "house", label: "Casa" },
  { value: "condominium", label: "Condominio" },
  { value: "other", label: "Otro" },
];

const DOCUMENT_TYPE_LABELS: Record<DocumentFormValues["type"], string> = {
  deed: "Escritura",
  insurance: "Seguro",
  invoice: "Factura",
  other: "Otro",
};

// Field order matches render order — used to find first error to scroll to
const FIELD_ORDER: (keyof PropertyFormValues)[] = [
  "name",
  "address",
  "type",
  "size",
  "year",
];

// ─── Section header ───────────────────────────────────────────────────────────

function FormSectionHeader({ children }: { children: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <Text className="text-[20px] font-manrope-bold text-primary">
        {children}
      </Text>
    </View>
  );
}

// ─── Document row ─────────────────────────────────────────────────────────────

interface DocumentRowProps {
  doc: DocumentFormValues & { id: string };
  onRemove: () => void;
}

function DocumentRow({ doc, onRemove }: DocumentRowProps) {
  const colors = useThemeColors();
  return (
    <View
      className="flex-row items-center gap-3 rounded-md px-4 py-3"
      style={{ borderWidth: 1, borderColor: colors.border }}
    >
      <FileText size={16} color={colors.mutedForeground} />
      <View className="flex-1">
        <Text
          className="text-[14px] font-inter-medium text-foreground"
          numberOfLines={1}
        >
          {doc.title}
        </Text>
        <Text className="text-[12px] font-inter text-muted-foreground">
          {DOCUMENT_TYPE_LABELS[doc.type]} · {doc.date}
        </Text>
      </View>
      <Button
        unstyled
        onPress={onRemove}
        className="w-8 h-8 items-center justify-center"
      >
        <Trash2 size={16} color={colors.mutedForeground} />
      </Button>
    </View>
  );
}

// ─── PropertyForm ─────────────────────────────────────────────────────────────

interface PropertyFormProps {
  defaultValues?: Partial<PropertyFormValues>;
  onSubmit: (
    values: PropertyFormValues,
    documents: DocumentFormValues[],
  ) => void;
  isSubmitting?: boolean;
  scrollViewRef?: React.RefObject<ScrollView | null>;
}

export function PropertyForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  scrollViewRef,
}: PropertyFormProps) {
  const colors = useThemeColors();
  const [documents, setDocuments] = useState<
    (DocumentFormValues & { id: string })[]
  >([]);
  const [addDocOpen, setAddDocOpen] = useState(false);

  // Tracks the Y offset (relative to this form's root View) of each field
  const fieldYRef = useRef<Partial<Record<keyof PropertyFormValues, number>>>(
    {},
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      address: "",
      type: null,
      size: undefined,
      year: undefined,
      ...defaultValues,
    },
  });

  function handleAddDocument(doc: DocumentFormValues) {
    setDocuments((prev) => [
      ...prev,
      { ...doc, id: Math.random().toString(36).slice(2) },
    ]);
  }

  function handleRemoveDocument(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }

  function scrollToFirstError(formErrors: FieldErrors<PropertyFormValues>) {
    const firstErrorField = FIELD_ORDER.find((f) => formErrors[f]);
    if (!firstErrorField) return;
    const y = fieldYRef.current[firstErrorField];
    if (y !== undefined) {
      scrollViewRef?.current?.scrollTo({
        y: Math.max(0, y - 16),
        animated: true,
      });
    }
  }

  function onFormSubmit(values: PropertyFormValues) {
    onSubmit(values, documents);
  }

  return (
    <View className="gap-8 px-5 py-6">
      {/* ── Información Básica ── */}
      <View className="gap-5">
        <FormSectionHeader>Información Básica</FormSectionHeader>

        <View
          onLayout={(e) => {
            fieldYRef.current.name = e.nativeEvent.layout.y;
          }}
        >
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Nombre de la Propiedad"
                placeholder="Ej. Loft Malasaña"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />
        </View>

        <View
          onLayout={(e) => {
            fieldYRef.current.address = e.nativeEvent.layout.y;
          }}
        >
          <Controller
            control={control}
            name="address"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Dirección Completa"
                placeholder="Calle Fuencarral 12, 4A, Madrid"
                icon={MapPin}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.address?.message}
              />
            )}
          />
        </View>

        <View
          onLayout={(e) => {
            fieldYRef.current.type = e.nativeEvent.layout.y;
          }}
        >
          <Controller
            control={control}
            name="type"
            render={({ field: { value, onChange } }) => (
              <Select
                label="Tipo de Propiedad"
                options={PROPERTY_TYPE_OPTIONS}
                value={value ?? null}
                onChange={onChange}
                placeholder="Selecciona un tipo"
                error={errors.type?.message}
              />
            )}
          />
        </View>
      </View>

      <Separator />

      {/* ── Detalles Técnicos ── */}
      <View className="gap-5">
        <FormSectionHeader>Detalles Técnicos</FormSectionHeader>

        <View
          onLayout={(e) => {
            fieldYRef.current.size = e.nativeEvent.layout.y;
          }}
        >
          <Controller
            control={control}
            name="size"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Tamaño (m²)"
                placeholder="85"
                keyboardType="numeric"
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.size?.message}
              />
            )}
          />
        </View>

        <View
          onLayout={(e) => {
            fieldYRef.current.year = e.nativeEvent.layout.y;
          }}
        >
          <Controller
            control={control}
            name="year"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Año de Compra"
                placeholder="2022"
                keyboardType="numeric"
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.year?.message}
              />
            )}
          />
        </View>
      </View>

      <Separator />

      {/* ── Documentos ── */}
      <View className="gap-5">
        <FormSectionHeader>Documentos</FormSectionHeader>

        {documents.length > 0 && (
          <View className="gap-3">
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                onRemove={() => handleRemoveDocument(doc.id)}
              />
            ))}
          </View>
        )}

        <Button
          unstyled
          onPress={() => setAddDocOpen(true)}
          className="items-center justify-center gap-2 rounded-md py-5"
          style={{
            borderWidth: 1.5,
            borderStyle: "dashed",
            borderColor: colors.border,
          }}
        >
          <View className="w-8 h-8 rounded-full bg-muted items-center justify-center">
            <Plus size={16} color={colors.mutedForeground} />
          </View>
          <Text className="text-[13px] font-inter-medium text-muted-foreground">
            Añadir documento
          </Text>
        </Button>
      </View>

      <Separator />

      {/* ── Submit ── */}
      <View className="gap-3">
        <Button
          size="lg"
          loading={isSubmitting}
          onPress={handleSubmit(onFormSubmit, scrollToFirstError)}
        >
          Guardar Propiedad
        </Button>
        <Text className="text-[12px] font-inter text-muted-foreground text-center">
          Al guardar, la propiedad será indexada en su historial global.
        </Text>
      </View>

      <AddDocumentSheet
        visible={addDocOpen}
        onClose={() => setAddDocOpen(false)}
        onAdd={handleAddDocument}
      />
    </View>
  );
}
