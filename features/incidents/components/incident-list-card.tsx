import { Badge, type BadgeVariant } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { CalendarDays } from "lucide-react-native";

import { Text, View } from "react-native";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  type IncidentStatus,
  type PriorityLevel,
} from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<IncidentStatus, BadgeVariant> = {
  open: "muted",
  in_progress: "accent-subtle",
  resolved: "success-subtle",
};

const PRIORITY_VARIANT: Record<PriorityLevel, BadgeVariant> = {
  high: "destructive-subtle",
  medium: "warning-subtle",
  low: "caution-subtle",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface IncidentListCardProps {
  title: string;
  description: string;
  status: IncidentStatus;
  priority: PriorityLevel | null;
  date: string;
  cost: number | null;
  onPress?: () => void;
  className?: string;
}

export function IncidentListCard({
  title,
  description,
  status,
  priority,
  date,
  cost,
  onPress,
  className = "mx-5 bg-card",
}: IncidentListCardProps) {
  const colors = useThemeColors();
  return (
    <Card onPress={onPress} className={className}>
      <CardHeader className="gap-3">
        {/* Status badge + priority badge */}
        <View className="flex-row items-center justify-between">
          <Badge variant={STATUS_VARIANT[status]}>
            {STATUS_LABELS[status]}
          </Badge>
          {priority && (
            <Badge variant={PRIORITY_VARIANT[priority]}>
              {PRIORITY_LABELS[priority]}
            </Badge>
          )}
        </View>

        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription numberOfLines={3} className="leading-5">
          {description}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <CalendarDays size={13} color={colors.mutedForeground} />
          <CardDescription>{formatDate(date)}</CardDescription>
        </View>
        {cost != null && (
          <Text className="text-[15px] font-manrope-bold text-primary">
            {`€${cost.toFixed(2)}`}
          </Text>
        )}
      </CardFooter>
    </Card>
  );
}
