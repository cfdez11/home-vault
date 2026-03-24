import { AppHeader } from "@/components/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Screen, ScreenSection } from "@/components/ui/screen";
import { Separator } from "@/components/ui/separator";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useRouter } from "expo-router";
import { AtSign, Circle, Pencil, Smartphone } from "lucide-react-native";
import { ActivityIndicator, Linking, Text, View } from "react-native";
import { useCompany } from "../hooks/use-companies";
import { CATEGORY_LABELS, type CompanyCategory } from "../types";

interface CompanyDetailScreenProps {
  companyId: number;
}

export default function CompanyDetailScreen({
  companyId,
}: CompanyDetailScreenProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const { data: company, isLoading } = useCompany(companyId);

  if (isLoading || !company) {
    return (
      <Screen header={<AppHeader title="Empresa" showBack />}>
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  const primaryCategory = company.categories[0] as CompanyCategory | undefined;
  const pendingIncidents = company.recentIncidents.filter(
    (i) => i.status !== "resolved",
  );

  return (
    <Screen header={<AppHeader title={company.name} showBack />}>
      {/* ── Info ── */}
      <ScreenSection padded={false}>
        <Card className="mx-5 bg-card">
          <CardContent className="pt-4 pb-4 gap-4">
            {/* Category */}
            <Badge variant={primaryCategory ? "accent-subtle" : "muted"}>
              {primaryCategory
                ? (CATEGORY_LABELS[primaryCategory] ?? primaryCategory)
                : "Sin categoría"}
            </Badge>

            <Separator />

            {/* Contact */}
            <View className="gap-3">
              {company.phone ? (
                <Button
                  unstyled
                  onPress={() =>
                    Linking.openURL(`tel:${company.phone!.replace(/\s/g, "")}`)
                  }
                  className="flex-row items-center gap-3"
                >
                  <View className="w-9 h-9 rounded-full bg-muted items-center justify-center">
                    <Smartphone size={16} color={colors.mutedForeground} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[11px] font-inter text-muted-foreground uppercase tracking-wide">
                      Teléfono
                    </Text>
                    <Text className="text-[15px] font-inter-medium text-foreground">
                      {company.phone}
                    </Text>
                  </View>
                </Button>
              ) : null}

              {company.email ? (
                <Button
                  unstyled
                  onPress={() => Linking.openURL(`mailto:${company.email}`)}
                  className="flex-row items-center gap-3"
                >
                  <View className="w-9 h-9 rounded-full bg-muted items-center justify-center">
                    <AtSign size={16} color={colors.mutedForeground} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[11px] font-inter text-muted-foreground uppercase tracking-wide">
                      Email
                    </Text>
                    <Text
                      className="text-[15px] font-inter-medium text-foreground"
                      numberOfLines={1}
                    >
                      {company.email}
                    </Text>
                  </View>
                </Button>
              ) : null}

              {!company.phone && !company.email && (
                <Text className="text-[13px] font-inter text-muted-foreground">
                  Sin datos de contacto
                </Text>
              )}
            </View>
          </CardContent>
        </Card>
      </ScreenSection>

      {/* ── Incidencias pendientes ── */}
      {pendingIncidents.length > 0 && (
        <ScreenSection title="Incidencias pendientes" padded={false}>
          <Card className="mx-5 bg-card">
            <CardContent className="pt-4 pb-4 gap-3">
              {pendingIncidents.map((incident) => (
                <View key={incident.id} className="flex-row items-center gap-3">
                  <Circle size={14} color={colors.destructive} />
                  <Text
                    className="flex-1 text-[14px] font-inter text-foreground"
                    numberOfLines={1}
                  >
                    {incident.title}
                  </Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </ScreenSection>
      )}

      {/* ── Edit button ── */}
      <ScreenSection>
        <Button
          size="lg"
          variant="outline"
          onPress={() => router.push(`/companies/${companyId}/edit` as any)}
        >
          <View className="flex-row items-center gap-2">
            <Pencil size={16} color={colors.foreground} />
            <Text className="text-[15px] font-inter-medium text-foreground">
              Editar empresa
            </Text>
          </View>
        </Button>
      </ScreenSection>
    </Screen>
  );
}
