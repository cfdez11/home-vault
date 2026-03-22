import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, History, X } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import {
  type IncidentStatus,
  type PropertyFilters,
  type PropertyType,
} from "../types";

// ─── Shared ───────────────────────────────────────────────────────────────────

function FilterSectionLabel({ children }: { children: string }) {
  return (
    <Text className="text-[15px] font-manrope-bold text-primary mb-4">
      {children}
    </Text>
  );
}

// ─── Property type ────────────────────────────────────────────────────────────

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Apartamento" },
  { value: "house", label: "Casa" },
  { value: "condominium", label: "Condominio" },
  { value: "other", label: "Otros" },
];

interface TypeChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function TypeChip({ label, selected, onPress }: TypeChipProps) {
  return (
    <Button
      unstyled
      onPress={onPress}
      className={cn("px-5 py-2.5 rounded-full", selected ? "bg-primary" : "bg-muted")}
    >
      <Text
        className={cn("text-[14px] font-inter-medium", selected ? "text-primary-foreground" : "text-foreground")}
      >
        {label}
      </Text>
    </Button>
  );
}

// ─── Incident status ──────────────────────────────────────────────────────────

const INCIDENT_OPTIONS: {
  value: IncidentStatus;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
}[] = [
  { value: "none", label: "Sin incidencias", Icon: CheckCircle2 },
  { value: "open", label: "Con incidencias abiertas", Icon: AlertCircle },
  { value: "resolved", label: "Recientemente solventadas", Icon: History },
];

interface IncidentOptionProps {
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  selected: boolean;
  onPress: () => void;
}

function IncidentOption({
  label,
  Icon,
  selected,
  onPress,
}: IncidentOptionProps) {
  const colors = useThemeColors();

  return (
    <View
      className={cn(
        "rounded-lg overflow-hidden border",
        selected ? "bg-primary border-primary" : "bg-muted border-transparent"
      )}
    >
      <Button
        unstyled
        onPress={onPress}
        className="flex-row items-center gap-3 px-4 py-3.5"
      >
        <View className="w-8 h-8 rounded-full items-center justify-center">
          <Icon
            size={20}
            color={selected ? colors.primaryForeground : colors.foreground}
          />
        </View>
        <Text
          className={cn("flex-1 text-[14px] font-inter-medium", selected ? "text-primary-foreground" : "text-foreground")}
        >
          {label}
        </Text>
        {selected ? (
          <View className="w-5 h-5 rounded-full bg-primary-foreground relative">
            <View className="w-2 h-2 rounded-full bg-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </View>
        ) : (
          <View className="w-5 h-5 rounded-full border-2 border-border bg-white" />
        )}
      </Button>
    </View>
  );
}

// ─── PropertiesFilterSheet ────────────────────────────────────────────────────

interface PropertiesFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
}

export function PropertiesFilterSheet({
  visible,
  onClose,
  filters,
  onChange,
}: PropertiesFilterSheetProps) {
  const colors = useThemeColors();

  function toggleType(type: PropertyType) {
    const next = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: next });
  }

  function setIncidentStatus(status: IncidentStatus) {
    onChange({
      ...filters,
      incidentStatus: filters.incidentStatus === status ? null : status,
    });
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="px-5 pt-4">
        <View className="flex-row items-start justify-between">
          <View className="gap-0.5">
            <Text className="text-[24px] font-manrope-bold text-primary">
              Filtros
            </Text>
            <Text className="text-[13px] font-inter text-muted-foreground">
              Personaliza tu búsqueda de propiedades
            </Text>
          </View>
          <Button
            unstyled
            onPress={onClose}
            className="w-11 h-11 rounded-full bg-muted items-center justify-center mt-0.5"
          >
            <X size={18} color={colors.mutedForeground} />
          </Button>
        </View>
        <Separator className="my-5" />
      </View>

      {/* Property type */}
      <View className="px-5 mb-7">
        <FilterSectionLabel>Tipo de Vivienda</FilterSectionLabel>
        <View className="flex-row flex-wrap gap-2">
          {PROPERTY_TYPES.map((pt) => (
            <TypeChip
              key={pt.value}
              label={pt.label}
              selected={filters.types.includes(pt.value)}
              onPress={() => toggleType(pt.value)}
            />
          ))}
        </View>
      </View>

      {/* Incident status */}
      <View className="px-5 mb-8">
        <FilterSectionLabel>Estado de Incidencias</FilterSectionLabel>
        <View className="flex-col gap-3">
          {INCIDENT_OPTIONS.map((opt, index) => (
            <IncidentOption
              key={opt.value}
              label={opt.label}
              Icon={opt.Icon}
              selected={filters.incidentStatus === opt.value}
              onPress={() => setIncidentStatus(opt.value)}
            />
          ))}
        </View>
      </View>
    </BottomSheet>
  );
}
