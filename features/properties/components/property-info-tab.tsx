import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Text, View } from "react-native";
import type { PropertyType } from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: "Apartamento",
  house: "Casa",
  condominium: "Condominio",
  other: "Otro",
};

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="flex-1 bg-card items-center">
      <CardContent className="items-center gap-1">
        <CardTitle className="text-[22px]">{value}</CardTitle>
        <Text className="text-[12px] font-inter text-muted-foreground text-center">
          {label}
        </Text>
      </CardContent>
    </Card>
  );
}

// ─── PropertyInfoTab ──────────────────────────────────────────────────────────

interface PropertyInfoTabProps {
  type: PropertyType | null;
  size: number | null;
  year: number | null;
  documentCount: number;
  incidentCount: number;
}

export function PropertyInfoTab({
  type,
  size,
  year,
  documentCount,
  incidentCount,
}: PropertyInfoTabProps) {
  return (
    <View className="pt-5 pb-2 mx-5 gap-3">
      {/* Superficie + Año */}
      <View className="flex-row gap-3">
        <StatCard label="Superficie" value={size ? `${size} m²` : "—"} />
        <StatCard label="Año de compra" value={year ? String(year) : "—"} />
      </View>

      {/* Documentos + Incidencias */}
      <View className="flex-row gap-3">
        <StatCard label="Documentos" value={String(documentCount)} />
        <StatCard label="Incidencias" value={String(incidentCount)} />
      </View>
    </View>
  );
}
