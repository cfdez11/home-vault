import { BottomSheet, SheetCloseButton, SheetDescription, SheetTitle } from "@/components/ui/bottom-sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text, View } from "react-native";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  type IncidentFilters,
  type IncidentStatus,
  type PriorityLevel,
} from "../types";

// ─── Shared ───────────────────────────────────────────────────────────────────

function FilterSectionLabel({ children }: { children: string }) {
  return (
    <Text className="text-[15px] font-manrope-bold text-primary mb-4">
      {children}
    </Text>
  );
}

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Button
      unstyled
      onPress={onPress}
      className={cn("px-5 py-2.5 rounded-full", selected ? "bg-primary" : "bg-muted")}
    >
      <Text
        className={cn(
          "text-[14px] font-inter-medium",
          selected ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {label}
      </Text>
    </Button>
  );
}

// ─── IncidentsFilterSheet ─────────────────────────────────────────────────────

const STATUSES: IncidentStatus[] = ["open", "in_progress", "resolved"];
const PRIORITIES: PriorityLevel[] = ["high", "medium", "low"];

interface IncidentsFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: IncidentFilters;
  onChange: (filters: IncidentFilters) => void;
}

export function IncidentsFilterSheet({
  visible,
  onClose,
  filters,
  onChange,
}: IncidentsFilterSheetProps) {
  function setStatus(status: IncidentStatus) {
    onChange({ ...filters, status: filters.status === status ? null : status });
  }

  function setPriority(priority: PriorityLevel) {
    onChange({ ...filters, priority: filters.priority === priority ? null : priority });
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="px-5 pt-4">
        <View className="flex-row items-start justify-between">
          <View className="gap-0.5">
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>Personaliza tu búsqueda de incidencias</SheetDescription>
          </View>
          <SheetCloseButton onPress={onClose} />
        </View>
        <Separator className="my-5" />
      </View>

      <View className="px-5 mb-7">
        <FilterSectionLabel>Estado</FilterSectionLabel>
        <View className="flex-row flex-wrap gap-2">
          {STATUSES.map((s) => (
            <FilterChip
              key={s}
              label={STATUS_LABELS[s]}
              selected={filters.status === s}
              onPress={() => setStatus(s)}
            />
          ))}
        </View>
      </View>

      <View className="px-5 mb-8">
        <FilterSectionLabel>Prioridad</FilterSectionLabel>
        <View className="flex-row flex-wrap gap-2">
          {PRIORITIES.map((p) => (
            <FilterChip
              key={p}
              label={PRIORITY_LABELS[p]}
              selected={filters.priority === p}
              onPress={() => setPriority(p)}
            />
          ))}
        </View>
      </View>
    </BottomSheet>
  );
}
