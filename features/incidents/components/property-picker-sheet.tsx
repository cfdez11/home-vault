import { BottomSheet, SheetTitle } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useProperties } from "@/features/properties/hooks/use-properties";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";

interface PropertyPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  value: string | null;
  onChange: (propertyId: number, propertyName: string) => void;
}

export function PropertyPickerSheet({
  visible,
  onClose,
  value,
  onChange,
}: PropertyPickerSheetProps) {
  const colors = useThemeColors();
  const { data: currentUser } = useCurrentUser();
  const { data: properties, isLoading } = useProperties(currentUser?.id ?? null);

  function handleSelect(id: number, name: string) {
    onChange(id, name);
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="px-5 pt-2 pb-6 gap-1">
        <SheetTitle className="mb-4">Propiedad</SheetTitle>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (properties ?? []).length === 0 ? (
          <Text className="text-[14px] font-inter text-muted-foreground text-center py-4">
            No tienes propiedades guardadas
          </Text>
        ) : (
          <>
            {(properties ?? []).map((property) => {
              const isSelected = value === property.name;
              return (
                <Button
                  key={property.id}
                  unstyled
                  onPress={() => handleSelect(property.id, property.name)}
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
                    {property.name}
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
