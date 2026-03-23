import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Briefcase, Smartphone } from "lucide-react-native";
import React, { useRef } from "react";
import { Controller, type FieldErrors, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { CATEGORY_LABELS, type CompanyCategory } from "../types";
import {
  companySchema,
  type CompanyFormValues,
} from "../schemas/company-schemas";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = (
  Object.entries(CATEGORY_LABELS) as [CompanyCategory, string][]
).map(([value, label]) => ({ value, label }));

const FIELD_ORDER: (keyof CompanyFormValues)[] = [
  "name",
  "phone",
  "email",
  "category",
];

// ─── Section header ───────────────────────────────────────────────────────────

function FormSectionHeader({ children }: { children: string }) {
  return (
    <Text className="text-[20px] font-manrope-bold text-primary">
      {children}
    </Text>
  );
}

// ─── CompanyForm ──────────────────────────────────────────────────────────────

interface CompanyFormProps {
  defaultValues?: Partial<CompanyFormValues>;
  onSubmit: (values: CompanyFormValues) => void;
  isSubmitting?: boolean;
  scrollViewRef?: React.RefObject<ScrollView | null>;
}

export function CompanyForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  scrollViewRef,
}: CompanyFormProps) {
  const fieldYRef = useRef<Partial<Record<keyof CompanyFormValues, number>>>({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      category: null,
      ...defaultValues,
    },
  });

  function scrollToFirstError(formErrors: FieldErrors<CompanyFormValues>) {
    const firstErrorField = FIELD_ORDER.find((f) => formErrors[f]);
    if (!firstErrorField) return;
    const y = fieldYRef.current[firstErrorField];
    if (y !== undefined) {
      scrollViewRef?.current?.scrollTo({ y: Math.max(0, y - 16), animated: true });
    }
  }

  return (
    <View className="gap-8 px-5 py-6">
      {/* ── Información ── */}
      <View className="gap-5">
        <FormSectionHeader>Información</FormSectionHeader>

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
                label="Nombre de la Empresa"
                placeholder="Ej. Fontanería García S.L."
                icon={Briefcase}
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
            fieldYRef.current.category = e.nativeEvent.layout.y;
          }}
        >
          <Controller
            control={control}
            name="category"
            render={({ field: { value, onChange } }) => (
              <Select
                label="Categoría"
                options={CATEGORY_OPTIONS}
                value={value ?? null}
                onChange={onChange}
                placeholder="Sin categoría asignada"
                error={errors.category?.message}
              />
            )}
          />
        </View>
      </View>

      <Separator />

      {/* ── Contacto ── */}
      <View className="gap-5">
        <FormSectionHeader>Contacto</FormSectionHeader>

        <View
          onLayout={(e) => {
            fieldYRef.current.phone = e.nativeEvent.layout.y;
          }}
        >
          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Teléfono"
                placeholder="+34 600 000 000"
                icon={Smartphone}
                keyboardType="phone-pad"
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
              />
            )}
          />
        </View>

        <View
          onLayout={(e) => {
            fieldYRef.current.email = e.nativeEvent.layout.y;
          }}
        >
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Email"
                placeholder="contacto@empresa.com"
                icon={AtSign}
                keyboardType="email-address"
                autoCapitalize="none"
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />
        </View>
      </View>

      <Separator />

      {/* ── Submit ── */}
      <View className="gap-3">
        <Button
          size="lg"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit, scrollToFirstError)}
        >
          Guardar Empresa
        </Button>
        <Text className="text-[12px] font-inter text-muted-foreground text-center">
          La empresa quedará disponible para asignarla a incidencias.
        </Text>
      </View>
    </View>
  );
}
