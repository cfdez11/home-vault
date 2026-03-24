import { PickerSheet } from "@/components/ui/picker-sheet";
import { useCompanies } from "@/features/companies/hooks/use-companies";

interface CompanyPickerSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Id of the currently selected company, or null. */
  value: number | null;
  onChange: (companyId: number | null, companyName: string | null) => void;
}

export function CompanyPickerSheet({
  visible,
  onClose,
  value,
  onChange,
}: CompanyPickerSheetProps) {
  const { data: companies, isLoading } = useCompanies();

  function handleSelect(id: string | number, label: string) {
    const isDeselect = value === id;
    onChange(isDeselect ? null : (id as number), isDeselect ? null : label);
  }

  return (
    <PickerSheet
      visible={visible}
      onClose={onClose}
      title="Empresa de Servicios"
      value={value}
      options={(companies ?? []).map((c) => ({ id: c.id, label: c.name }))}
      onSelect={handleSelect}
      isLoading={isLoading}
      emptyText="No tienes empresas guardadas"
    />
  );
}
