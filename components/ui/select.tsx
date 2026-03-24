import { PickerSheet } from "@/components/ui/picker-sheet";
import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectProps<T extends string = string> {
  label?: string;
  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function Select<T extends string = string>({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecciona una opción",
  error,
  className,
}: SelectProps<T>) {
  const colors = useThemeColors();
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <View className={cn("gap-1.5", className)}>
      {label && (
        <Text className="text-[11px] font-inter-semibold text-primary uppercase tracking-widest">
          {label}
        </Text>
      )}

      <Button
        unstyled
        onPress={() => setOpen(true)}
        className={cn(
          "flex-row items-center bg-muted rounded-sm px-4 h-[52px] gap-3",
          error && "border border-destructive"
        )}
      >
        <Text
          className={cn(
            "flex-1 text-[15px] font-inter",
            selectedLabel ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {selectedLabel ?? placeholder}
        </Text>
        <ChevronDown size={18} color={colors.mutedForeground} />
      </Button>

      {error && (
        <Text className="text-[12px] font-inter text-destructive">{error}</Text>
      )}

      <PickerSheet
        visible={open}
        onClose={() => setOpen(false)}
        title={label ?? placeholder}
        value={value}
        options={options.map((o) => ({ id: o.value, label: o.label }))}
        onSelect={(id) => onChange(id as T)}
      />
    </View>
  );
}
