import { PickerSheet } from "@/components/ui/picker-sheet";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useProperties } from "@/features/properties/hooks/use-properties";

interface PropertyPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Id of the currently selected property, or null. */
  value: number | null;
  onChange: (propertyId: number, propertyName: string) => void;
}

export function PropertyPickerSheet({
  visible,
  onClose,
  value,
  onChange,
}: PropertyPickerSheetProps) {
  const { data: currentUser } = useCurrentUser();
  const { data: properties, isLoading } = useProperties(currentUser?.id ?? null);

  return (
    <PickerSheet
      visible={visible}
      onClose={onClose}
      title="Propiedad"
      value={value}
      options={(properties ?? []).map((p) => ({ id: p.id, label: p.name }))}
      onSelect={(id, label) => onChange(id as number, label)}
      isLoading={isLoading}
      emptyText="No tienes propiedades guardadas"
    />
  );
}
