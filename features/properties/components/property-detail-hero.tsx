import { Badge } from "@/components/ui/badge";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { MapPin } from "lucide-react-native";
import { Text, View } from "react-native";
import { type PropertyType } from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: "Apartamento",
  house: "Casa",
  condominium: "Condominio",
  other: "Otro",
};

// ─── PropertyDetailHero ───────────────────────────────────────────────────────

export interface PropertyDetailHeroProps {
  name: string;
  address: string;
  type: PropertyType | null;
}

export function PropertyDetailHero({
  name,
  address,
  type,
}: PropertyDetailHeroProps) {
  const colors = useThemeColors();

  return (
    <View className="gap-3 px-5 pt-4 pb-6">
      {/* Name + type badge + address */}
      <View className="gap-2">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-[22px] font-manrope-bold text-primary leading-7">
            {name}
          </Text>
          {type && <Badge variant="card">{PROPERTY_TYPE_LABELS[type]}</Badge>}
        </View>

        <View className="flex-row items-center gap-2">
          <MapPin size={14} color={colors.mutedForeground} />
          <Text
            className="flex-1 text-[13px] font-inter text-muted-foreground"
            numberOfLines={2}
          >
            {address}
          </Text>
        </View>
      </View>
    </View>
  );
}
