import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, X } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { type DocumentFormValues, documentSchema } from "../schemas/property-schemas";

const DOCUMENT_TYPE_OPTIONS = [
  { value: "deed", label: "Escritura" },
  { value: "insurance", label: "Seguro" },
  { value: "invoice", label: "Factura" },
  { value: "other", label: "Otro" },
] as const;

interface AddDocumentSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (doc: DocumentFormValues) => void;
}

export function AddDocumentSheet({ visible, onClose, onAdd }: AddDocumentSheetProps) {
  const colors = useThemeColors();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: { title: "", type: "other", date: "", url: "", notes: "" },
  });

  function onSubmit(data: DocumentFormValues) {
    onAdd(data);
    reset();
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} keyboardAvoiding>
      <View className="px-5 pt-4 pb-8 gap-5">
        {/* Header */}
        <View className="flex-row items-start justify-between">
          <View className="gap-0.5">
            <Text className="text-[24px] font-manrope-bold text-primary">
              Añadir Documento
            </Text>
            <Text className="text-[13px] font-inter text-muted-foreground">
              Adjunta un documento a esta propiedad
            </Text>
          </View>
          <Button
            unstyled
            onPress={onClose}
            className="w-11 h-11 rounded-full bg-muted items-center justify-center mt-0.5"
          >
            <X size={18} color={colors.mutedForeground} />
          </Button>
        </View>

        <Separator />

        {/* Title */}
        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Título"
              placeholder="Ej. Escritura de compraventa"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.title?.message}
            />
          )}
        />

        {/* Type */}
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <Select
              label="Tipo de documento"
              options={DOCUMENT_TYPE_OPTIONS}
              value={value}
              onChange={onChange}
              error={errors.type?.message}
            />
          )}
        />

        {/* Date */}
        <Controller
          control={control}
          name="date"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Fecha"
              placeholder="AAAA-MM-DD"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.date?.message}
            />
          )}
        />

        {/* URL */}
        <Controller
          control={control}
          name="url"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="URL / Enlace"
              placeholder="https://..."
              icon={Link}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              error={errors.url?.message}
            />
          )}
        />

        {/* Notes */}
        <Controller
          control={control}
          name="notes"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Notas (opcional)"
              placeholder="Observaciones..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <Button onPress={handleSubmit(onSubmit)}>Añadir documento</Button>
      </View>
    </BottomSheet>
  );
}
