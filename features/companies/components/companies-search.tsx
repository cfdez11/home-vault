import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScreenSection } from "@/components/ui/screen";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { Text, View } from "react-native";

interface CompaniesSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}

export function CompaniesSearch({
  value,
  onChangeText,
  onOpenFilters,
  activeFilterCount,
}: CompaniesSearchProps) {
  const colors = useThemeColors();
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <ScreenSection>
      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <Input
            icon={Search}
            placeholder="Buscar por nombre o categoría..."
            containerClassName="rounded-full"
            value={value}
            onChangeText={onChangeText}
            autoCorrect={false}
          />
        </View>
        <View>
          <Button
            unstyled
            onPress={onOpenFilters}
            className={cn(
              "w-[52px] h-[52px] rounded-full items-center justify-center",
              hasActiveFilters ? "bg-primary" : "bg-muted"
            )}
          >
            <SlidersHorizontal
              size={18}
              color={hasActiveFilters ? colors.primaryForeground : colors.foreground}
            />
          </Button>
          {hasActiveFilters && (
            <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive items-center justify-center">
              <Text className="text-[10px] font-inter-semibold text-destructive-foreground">
                {activeFilterCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScreenSection>
  );
}
