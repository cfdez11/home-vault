import { BottomSheet, SheetTitle } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";

export interface PickerOption {
  id: string | number;
  label: string;
}

export interface PickerSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** Id of the currently selected option. */
  value: string | number | null;
  options: PickerOption[];
  onSelect: (id: string | number, label: string) => void;
  isLoading?: boolean;
  emptyText?: string;
}

export function PickerSheet({
  visible,
  onClose,
  title,
  value,
  options,
  onSelect,
  isLoading = false,
  emptyText = "No hay opciones disponibles",
}: PickerSheetProps) {
  const colors = useThemeColors();

  function handleSelect(id: string | number, label: string) {
    onSelect(id, label);
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="px-5 pt-2 pb-6 gap-1">
        <SheetTitle className="mb-4">{title}</SheetTitle>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : options.length === 0 ? (
          <Text className="text-[14px] font-inter text-muted-foreground text-center py-4">
            {emptyText}
          </Text>
        ) : (
          <>
            {options.map((option) => {
              const isSelected = option.id === value;
              return (
                <Button
                  key={option.id}
                  unstyled
                  onPress={() => handleSelect(option.id, option.label)}
                  className={cn(
                    "flex-row items-center justify-between px-4 py-4 rounded-lg",
                    isSelected ? "bg-primary" : "bg-muted"
                  )}
                >
                  <Text
                    className={cn(
                      "text-[15px] font-inter-medium",
                      isSelected ? "text-primary-foreground" : "text-foreground"
                    )}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Check size={18} color={colors.primaryForeground} />
                  )}
                </Button>
              );
            })}
          </>
        )}
      </View>
    </BottomSheet>
  );
}
