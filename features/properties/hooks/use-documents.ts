import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as propertiesService from "@/features/properties/services/properties-service";
import type { DocumentFormValues } from "@/features/properties/schemas/property-schemas";

export const documentKeys = {
  byProperty: (propertyId: number) =>
    ["documents", "property", propertyId] as const,
};

export function useDocuments(propertyId: number | null) {
  return useQuery({
    queryKey: documentKeys.byProperty(propertyId!),
    queryFn: async () => {
      const result = await propertiesService.getDocuments(propertyId!);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!propertyId,
  });
}

export function useCreateDocument(propertyId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: DocumentFormValues) =>
      propertiesService.createDocument(propertyId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.byProperty(propertyId),
      });
    },
  });
}

export function useDeleteDocument(propertyId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => propertiesService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.byProperty(propertyId),
      });
    },
  });
}
