import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useThemeColors } from "@/hooks/use-theme-colors";
import {
  AlertTriangle,
  CheckCircle,
  Folder,
  MapPin,
} from "lucide-react-native";
import { View } from "react-native";

interface PropertyListCardProps {
  name: string;
  address: string;
  incidents?: number;
  docsCount: number;
  onPress?: () => void;
  className?: string;
}

export function PropertyListCard({
  name,
  address,
  incidents,
  docsCount,
  onPress,
  className = "mx-5 bg-card",
}: PropertyListCardProps) {
  const colors = useThemeColors();

  return (
    <Card onPress={onPress} className={className}>
      <CardContent className="pt-4 pb-4 gap-1.5">
        <CardTitle>{name}</CardTitle>

        <View className="flex-row items-center gap-1">
          <MapPin size={13} color={colors.mutedForeground} />
          <CardDescription numberOfLines={1} className="flex-1">
            {address}
          </CardDescription>
        </View>

        <View className="flex-row gap-2 mt-1">
          {incidents !== undefined && incidents > 0 ? (
            <Badge variant="destructive-subtle" icon={AlertTriangle}>
              {`${incidents} ${incidents === 1 ? "Incidencia" : "Incidencias"}`}
            </Badge>
          ) : (
            <Badge variant="success-subtle" icon={CheckCircle}>
              Al día
            </Badge>
          )}
          <Badge variant="muted" icon={Folder}>{`${docsCount} Docs`}</Badge>
        </View>
      </CardContent>
    </Card>
  );
}
