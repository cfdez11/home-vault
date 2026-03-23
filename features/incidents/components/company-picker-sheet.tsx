import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/features/companies/types";
import { Check, Search, X } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";

// ─── Demo data — replace with Supabase query ──────────────────────────────────

const DEMO_COMPANIES = [
  { id: "1", name: "Voltio Express S.L.", category: "electricista" },
  { id: "2", name: "AquaFix Fontanería", category: "fontanero" },
  { id: "3", name: "ClimaPro S.A.", category: "climatizacion" },
] as const;

// ─── CompanyPickerSheet ───────────────────────────────────────────────────────

interface CompanyPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  value: string | null;
  onChange: (companyName: string | null) => void;
}

export function CompanyPickerSheet({
  visible,
  onClose,
  value,
  onChange,
}: CompanyPickerSheetProps) {
  const colors = useThemeColors();
  const [search, setSearch] = useState("");

  const filtered = DEMO_COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(name: string) {
    onChange(name === value ? null : name);
    setSearch("");
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="px-5 pt-4 pb-8 gap-4">
        {/* Header */}
        <View className="flex-row items-start justify-between">
          <Text className="text-[24px] font-manrope-bold text-primary">
            Empresa de Servicios
          </Text>
          <Button
            unstyled
            onPress={onClose}
            className="w-11 h-11 rounded-full bg-muted items-center justify-center mt-0.5"
          >
            <X size={18} color={colors.mutedForeground} />
          </Button>
        </View>

        <Input
          icon={Search}
          placeholder="Buscar empresa..."
          containerClassName="rounded-full"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />

        <View className="gap-1">
          {filtered.map((company) => {
            const isSelected = value === company.name;
            return (
              <Button
                key={company.id}
                unstyled
                onPress={() => handleSelect(company.name)}
                className={cn(
                  "flex-row items-center justify-between px-4 py-4 rounded-lg",
                  isSelected ? "bg-primary" : "bg-muted"
                )}
              >
                <View className="flex-1">
                  <Text
                    className={cn(
                      "text-[15px] font-inter-medium",
                      isSelected ? "text-primary-foreground" : "text-foreground"
                    )}
                  >
                    {company.name}
                  </Text>
                  <Text
                    className={cn(
                      "text-[12px] font-inter",
                      isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {CATEGORY_LABELS[company.category]}
                  </Text>
                </View>
                {isSelected && (
                  <Check size={18} color={colors.primaryForeground} />
                )}
              </Button>
            );
          })}
        </View>
      </View>
    </BottomSheet>
  );
}
