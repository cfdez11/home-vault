import { Button } from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useRouter } from "expo-router";
import { BellPlus, Briefcase, Building2, Plus, X } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface FabActionProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

function FabAction({ icon, label, onPress }: FabActionProps) {
  return (
    <Button
      unstyled
      onPress={onPress}
      className="flex-row items-center bg-card rounded-md px-6 py-4 gap-2"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      {icon}
      <Text className="font-inter-medium text-primary">{label}</Text>
    </Button>
  );
}

export interface FabMenuProps {
  expanded: boolean;
  onToggle: () => void;
}

export function FabMenu({ expanded, onToggle }: FabMenuProps) {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <View
      className="absolute bottom-24 right-5 items-end gap-3"
      pointerEvents="box-none"
    >
      {expanded && (
        <View className="gap-3 items-end">
          <FabAction
            icon={<BellPlus size={18} color={colors.primary} />}
            label="Añadir Incidencia"
            onPress={() => router.push('/incidencias/new' as any)}
          />
          <FabAction
            icon={<Building2 size={18} color={colors.primary} />}
            label="Añadir Propiedad"
            onPress={() => router.push('/(tabs)/propiedades')}
          />
          <FabAction
            icon={<Briefcase size={18} color={colors.primary} />}
            label="Añadir Empresa"
            onPress={() => router.push('/(tabs)/empresas')}
          />
        </View>
      )}
      <Button
        unstyled
        onPress={onToggle}
        activeOpacity={0.9}
        className="bg-primary items-center justify-center w-16 h-16 rounded-full"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        {expanded ? (
          <X size={26} color={colors.primaryForeground} />
        ) : (
          <Plus size={26} color={colors.primaryForeground} />
        )}
      </Button>
    </View>
  );
}
