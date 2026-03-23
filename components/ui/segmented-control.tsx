import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/utils";
import React from "react";
import { Text, View } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T | null;
  onValueChange: (value: T) => void;
  label?: string;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onValueChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  const colors = useThemeColors();

  return (
    <View className={cn("gap-1.5", className)}>
      {label && (
        <Text className="text-[11px] font-inter-semibold text-primary uppercase tracking-widest">
          {label}
        </Text>
      )}

      <View className="flex-row bg-muted rounded-sm p-1 gap-1">
        {options.map((option) => {
          const isActive = option.value === value;
          const Icon = option.icon;

          return (
            <Button
              key={option.value}
              unstyled
              onPress={() => onValueChange(option.value)}
              className={cn(
                "flex-1 flex-row items-center justify-center gap-1.5 py-3 rounded-[10px]",
                isActive && "bg-primary",
              )}
            >
              {Icon && (
                <Icon
                  size={14}
                  color={
                    isActive ? colors.primaryForeground : colors.mutedForeground
                  }
                />
              )}
              <Text
                className={cn(
                  "text-[13px] font-inter-medium",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {option.label}
              </Text>
            </Button>
          );
        })}
      </View>
    </View>
  );
}
