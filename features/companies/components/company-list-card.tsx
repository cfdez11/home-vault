import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { AtSign, Circle, CircleCheck, Smartphone } from "lucide-react-native";
import { Linking, View } from "react-native";
import { CATEGORY_LABELS, type CompanyCategory } from "../types";

export interface RecentIncident {
  id: number;
  title: string;
  status: "open" | "in_progress" | "resolved";
}

export interface CompanyListCardProps {
  name: string;
  categories: string[];
  phone: string | null;
  email: string | null;
  pendingIncidents: number;
  recentIncidents: RecentIncident[];
  onPress?: () => void;
  className?: string;
}

export function CompanyListCard({
  name,
  categories,
  phone,
  email,
  pendingIncidents,
  recentIncidents,
  onPress,
  className = "mx-5 bg-card",
}: CompanyListCardProps) {
  const colors = useThemeColors();
  const primaryCategory = categories[0] as CompanyCategory | undefined;

  function handleCall() {
    if (!phone) return;
    Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
  }

  function handleEmail() {
    if (!email) return;
    Linking.openURL(`mailto:${email}`);
  }

  return (
    <Card onPress={onPress} className={className}>
      <CardHeader className="gap-2">
        <View className="flex-row items-start justify-start gap-2">
          <Badge variant={primaryCategory ? "accent-subtle" : "muted"}>
            {primaryCategory
              ? (CATEGORY_LABELS[primaryCategory] ?? primaryCategory)
              : "Sin categoría"}
          </Badge>
          {pendingIncidents > 0 && (
            <Badge variant="destructive-subtle">
              {`${pendingIncidents} ${pendingIncidents === 1 ? "Incidencia" : "Incidencias"}`}
            </Badge>
          )}
        </View>
        <CardTitle>{name}</CardTitle>
      </CardHeader>

      {/* Contact info */}
      <CardContent className="gap-2">
        {phone && (
          <Button
            unstyled
            onPress={handleCall}
            className="flex-row items-center gap-2"
          >
            <Smartphone size={13} color={colors.mutedForeground} />
            <CardDescription className="flex-1">{phone}</CardDescription>
          </Button>
        )}
        {email && (
          <Button
            unstyled
            onPress={handleEmail}
            className="flex-row items-center gap-2"
          >
            <AtSign size={13} color={colors.mutedForeground} />
            <CardDescription className="flex-1" numberOfLines={1}>
              {email}
            </CardDescription>
          </Button>
        )}
      </CardContent>

      {/* Incidents section — only shown when there are pending incidents */}
      {recentIncidents.some((i) => i.status !== "resolved") && (
        <CardFooter className="flex-col items-stretch gap-3">
          <Separator />
          <View className="gap-2">
            {recentIncidents
              .filter((i) => i.status !== "resolved")
              .map((incident) => (
                <View key={incident.id} className="flex-row items-center gap-3">
                  {incident.status === "resolved" ? (
                    <CircleCheck size={14} color={colors.mutedForeground} />
                  ) : (
                    <Circle size={14} color={colors.mutedForeground} />
                  )}
                  <CardDescription className="flex-1" numberOfLines={1}>
                    {incident.title}
                  </CardDescription>
                </View>
              ))}
          </View>
        </CardFooter>
      )}
    </Card>
  );
}
