import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { CalendarDays } from "lucide-react-native";
import { Linking, View } from "react-native";

// ─── Constants ────────────────────────────────────────────────────────────────

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  deed: "Escritura",
  insurance: "Seguro",
  invoice: "Factura",
  other: "Otro",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── PropertyDocumentRow ──────────────────────────────────────────────────────

export interface PropertyDocumentRowProps {
  title: string;
  type: string;
  date: string;
  url?: string | null;
  notes?: string | null;
  className?: string;
}

export function PropertyDocumentRow({
  title,
  type,
  date,
  url,
  notes,
  className = "mx-5 bg-card",
}: PropertyDocumentRowProps) {
  const colors = useThemeColors();

  return (
    <Card onPress={url ? () => Linking.openURL(url) : undefined} className={className}>
      <CardHeader className="gap-3">
        <Badge variant="muted" className="self-start">
          {DOCUMENT_TYPE_LABELS[type] ?? type}
        </Badge>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      {notes ? (
        <CardContent>
          <CardDescription numberOfLines={2}>{notes}</CardDescription>
        </CardContent>
      ) : null}

      <CardFooter>
        <View className="flex-row items-center gap-2">
          <CalendarDays size={13} color={colors.mutedForeground} />
          <CardDescription>{formatDate(date)}</CardDescription>
        </View>
      </CardFooter>
    </Card>
  );
}
