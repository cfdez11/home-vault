import { useThemeColors } from "@/hooks/use-theme-colors";
import { Badge } from "@/components/ui/badge";
import { ScreenSection } from "@/components/ui/screen";
import { useRouter } from "expo-router";
import { AlertTriangle, FileText } from "lucide-react-native";
import { View } from "react-native";
import { StatCard } from "./stat-card";

interface SummarySectionProps {
  openIncidents: number;
  newDocuments: number;
}

export function SummarySection({ openIncidents, newDocuments }: SummarySectionProps) {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <ScreenSection title="Resumen de Hoy">
      <View className="flex-row gap-3">
        <StatCard
          containerClassName="bg-destructive-subtle"
          valueClassName="text-destructive"
          labelClassName="text-destructive"
          icon={<AlertTriangle size={22} color={colors.destructive} />}
          indicator={
            <Badge variant="destructive" size="sm" uppercase>
              Urgente
            </Badge>
          }
          value={openIncidents}
          label={`Incidencias\nAbiertas`}
          onPress={() => router.push("/(tabs)/incidents" as any)}
        />
        <StatCard
          containerClassName="bg-accent-subtle"
          valueClassName="text-accent"
          labelClassName="text-accent"
          icon={<FileText size={22} color={colors.accent} />}
          indicator={<View className="w-2.5 h-2.5 rounded-full bg-primary" />}
          value={newDocuments}
          label={`Nuevos\nDocumentos`}
        />
      </View>
    </ScreenSection>
  );
}
