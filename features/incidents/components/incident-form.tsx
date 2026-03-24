import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Euro, FileText, Plus, Trash2 } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { AddDocumentSheet } from "@/features/properties/components/add-document-sheet";
import type { DocumentFormValues } from "@/features/properties/schemas/property-schemas";
import {
  incidentSchema,
  type IncidentFormValues,
} from "../schemas/incident-schemas";
import { CompanyPickerSheet } from "./company-picker-sheet";
import { PropertyPickerSheet } from "./property-picker-sheet";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "open", label: "Abierta" },
  { value: "in_progress", label: "En proceso" },
  { value: "resolved", label: "Resuelta" },
];

const PRIORITY_OPTIONS = [
  { value: "high", label: "Alta" },
  { value: "medium", label: "Media" },
  { value: "low", label: "Baja" },
];

const DOCUMENT_TYPE_LABELS: Record<DocumentFormValues["type"], string> = {
  deed: "Escritura",
  insurance: "Seguro",
  invoice: "Factura",
  other: "Otro",
};

const FIELD_ORDER: (keyof IncidentFormValues)[] = [
  "title",
  "description",
  "status",
  "priority",
  "date",
  "cost",
  "propertyId",
  "companyName",
];

// ─── Section header ───────────────────────────────────────────────────────────

function FormSectionHeader({ children }: { children: string }) {
  return (
    <Text className="text-[20px] font-manrope-bold text-primary">
      {children}
    </Text>
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

// ─── IncidentForm ─────────────────────────────────────────────────────────────

interface IncidentFormProps {
  initialPropertyId?: number;
  defaultValues?: Partial<IncidentFormValues>;
  onSubmit: (
    values: IncidentFormValues,
    documents: DocumentFormValues[],
    companyId: number | null,
  ) => void;
  isSubmitting?: boolean;
  scrollViewRef?: React.RefObject<ScrollView | null>;
}

export function IncidentForm({
  initialPropertyId,
  defaultValues,
  onSubmit,
  isSubmitting,
  scrollViewRef,
}: IncidentFormProps) {
  const colors = useThemeColors();
  const [documents, setDocuments] = useState<(DocumentFormValues & { id: string })[]>([]);
  const [addDocOpen, setAddDocOpen] = useState(false);
  const [companyPickerOpen, setCompanyPickerOpen] = useState(false);
  const [propertyPickerOpen, setPropertyPickerOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [selectedPropertyName, setSelectedPropertyName] = useState<string | null>(null);

  const fieldYRef = useRef<Partial<Record<keyof IncidentFormValues, number>>>({});

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "open",
      priority: null,
      date: "",
      cost: undefined,
      companyName: undefined,
      propertyId: initialPropertyId,
      ...defaultValues,
    },
  });

  const companyName = watch("companyName");

  function handleAddDocument(doc: DocumentFormValues) {
    setDocuments((prev) => [
      ...prev,
      { ...doc, id: Math.random().toString(36).slice(2) },
    ]);
  }

  function handleRemoveDocument(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }

  function scrollToFirstError(formErrors: FieldErrors<IncidentFormValues>) {
    const firstErrorField = FIELD_ORDER.find((f) => formErrors[f]);
    if (!firstErrorField) return;
    const y = fieldYRef.current[firstErrorField];
    if (y !== undefined) {
      scrollViewRef?.current?.scrollTo({ y: Math.max(0, y - 16), animated: true });
    }
  }

  function onFormSubmit(values: IncidentFormValues) {
    onSubmit(values, documents, selectedCompanyId);
  }

  return (
    <View className="gap-8 px-5 py-6">
      {/* ── Información ── */}
      <View className="gap-5">
        <FormSectionHeader>Información</FormSectionHeader>

        <View onLayout={(e) => { fieldYRef.current.title = e.nativeEvent.layout.y; }}>
          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Título de la Incidencia"
                placeholder="Ej. Fuga de agua en baño"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.title?.message}
              />
            )}
          />
        </View>

        <View onLayout={(e) => { fieldYRef.current.description = e.nativeEvent.layout.y; }}>
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Descripción Detallada"
                placeholder="Describe la incidencia con el máximo detalle posible..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.description?.message}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            )}
          />
        </View>
      </View>

      <Separator />

      {/* ── Estado y Prioridad ── */}
      <View className="gap-5">
        <FormSectionHeader>Estado y Prioridad</FormSectionHeader>

        <View onLayout={(e) => { fieldYRef.current.status = e.nativeEvent.layout.y; }}>
          <Controller
            control={control}
            name="status"
            render={({ field: { value, onChange } }) => (
              <Select
                label="Estado"
                options={STATUS_OPTIONS}
                value={value}
                onChange={onChange}
                error={errors.status?.message}
              />
            )}
          />
        </View>

        <View onLayout={(e) => { fieldYRef.current.priority = e.nativeEvent.layout.y; }}>
          <Controller
            control={control}
            name="priority"
            render={({ field: { value, onChange } }) => (
              <Select
                label="Prioridad"
                options={PRIORITY_OPTIONS}
                value={value ?? null}
                onChange={onChange}
                placeholder="Sin prioridad asignada"
                error={errors.priority?.message}
              />
            )}
          />
        </View>
      </View>

      <Separator />

      {/* ── Detalles ── */}
      <View className="gap-5">
        <FormSectionHeader>Detalles</FormSectionHeader>

        <View onLayout={(e) => { fieldYRef.current.date = e.nativeEvent.layout.y; }}>
          <Controller
            control={control}
            name="date"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Fecha de Registro"
                placeholder="AAAA-MM-DD"
                icon={CalendarDays}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.date?.message}
              />
            )}
          />
        </View>

        <View onLayout={(e) => { fieldYRef.current.cost = e.nativeEvent.layout.y; }}>
          <Controller
            control={control}
            name="cost"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Coste (€)"
                placeholder="0.00"
                icon={Euro}
                keyboardType="decimal-pad"
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.cost?.message}
              />
            )}
          />
        </View>
      </View>

      <Separator />

      {/* ── Propiedad (requerida, solo cuando no viene pre-seleccionada) ── */}
      {!initialPropertyId && (
        <View className="gap-5">
          <FormSectionHeader>Propiedad</FormSectionHeader>
          <View
            className="gap-1.5"
            onLayout={(e) => { fieldYRef.current.propertyId = e.nativeEvent.layout.y; }}
          >
            <Text className="text-[11px] font-inter-semibold text-primary uppercase tracking-widest">
              Propiedad
            </Text>
            <Button
              unstyled
              onPress={() => setPropertyPickerOpen(true)}
              className={cn(
                "flex-row items-center bg-muted rounded-sm px-4 h-[52px] gap-3",
                errors.propertyId && "border border-destructive"
              )}
            >
              <Text
                className={cn(
                  "flex-1 text-[15px] font-inter",
                  selectedPropertyName ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {selectedPropertyName ?? "Selecciona una propiedad"}
              </Text>
            </Button>
            {errors.propertyId && (
              <Text className="text-[12px] font-inter text-destructive">
                {errors.propertyId.message}
              </Text>
            )}
          </View>
        </View>
      )}

      <Separator />

      {/* ── Empresa de Servicios (opcional) ── */}
      <View className="gap-5">
        <FormSectionHeader>Empresa de Servicios</FormSectionHeader>

        <View
          className="gap-1.5"
          onLayout={(e) => { fieldYRef.current.companyName = e.nativeEvent.layout.y; }}
        >
          <Text className="text-[11px] font-inter-semibold text-primary uppercase tracking-widest">
            Empresa de Servicios
          </Text>
          <Button
            unstyled
            onPress={() => setCompanyPickerOpen(true)}
            className="flex-row items-center bg-muted rounded-sm px-4 h-[52px] gap-3"
          >
            <Text
              className={cn(
                "flex-1 text-[15px] font-inter",
                companyName ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {companyName ?? "Selecciona una empresa (opcional)"}
            </Text>
          </Button>
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
          Guardar Incidencia
        </Button>
        <Text className="text-[12px] font-inter text-muted-foreground text-center">
          Al guardar, la incidencia quedará registrada en el historial de la propiedad.
        </Text>
      </View>

      <AddDocumentSheet
        visible={addDocOpen}
        onClose={() => setAddDocOpen(false)}
        onAdd={handleAddDocument}
      />

      <CompanyPickerSheet
        visible={companyPickerOpen}
        onClose={() => setCompanyPickerOpen(false)}
        value={selectedCompanyId}
        onChange={(companyId, name) => {
          setSelectedCompanyId(companyId);
          setValue("companyName", name ?? undefined);
        }}
      />

      <PropertyPickerSheet
        visible={propertyPickerOpen}
        onClose={() => setPropertyPickerOpen(false)}
        value={watch("propertyId") ?? null}
        onChange={(propertyId, propertyName) => {
          setValue("propertyId", propertyId, { shouldValidate: true });
          setSelectedPropertyName(propertyName);
        }}
      />
    </View>
  );
}
