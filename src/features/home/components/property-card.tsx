import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useThemeColors } from "@/hooks/use-theme-colors";
import {
  AlertTriangle,
  CheckCircle,
  Folder,
  MapPin,
} from "lucide-react-native";
import { Text, View } from "react-native";

interface PropertyCardProps {
  name: string;
  year: string;
  address: string;
  imageBgColor: string;
  tagLabel: string;
  incidents?: number;
  docsCount: number;
  onPress?: () => void;
  className?: string;
}

export function PropertyCard({
  name,
  year,
  address,
  imageBgColor,
  tagLabel,
  incidents,
  docsCount,
  onPress,
  className = "mx-5 bg-card",
}: PropertyCardProps) {
  const colors = useThemeColors();

  return (
    <Card onPress={onPress} className={className}>
      {/* Image */}
      <View
        className="mx-3 mt-3 h-[180px] rounded-md overflow-hidden"
        style={{ backgroundColor: imageBgColor }}
      >
        <Badge
          variant="card"
          size="sm"
          uppercase
          className="absolute top-3 right-3"
        >
          {tagLabel}
        </Badge>
      </View>

      {/* Content */}
      <View className="px-4 pt-3 pb-4 gap-1.5">
        <View className="flex-row justify-between items-baseline">
          <Text className="text-[18px] font-manrope-bold text-primary flex-1 mr-2">
            {name}
          </Text>
          <Text className="text-[13px] font-inter-medium text-primary">
            {year}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <MapPin size={13} color={colors.mutedForeground} />
          <Text className="text-[13px] font-inter text-muted-foreground">
            {address}
          </Text>
        </View>

        <View className="flex-row gap-2 mt-1">
          {incidents !== undefined && incidents > 0 ? (
            <Badge variant="destructive-subtle" icon={AlertTriangle}>
              {`${incidents} Incidencias`}
            </Badge>
          ) : (
            <Badge variant="success-subtle" icon={CheckCircle}>
              Al día
            </Badge>
          )}
          <Badge variant="muted" icon={Folder}>{`${docsCount} Docs`}</Badge>
        </View>
      </View>
    </Card>
  );
}
