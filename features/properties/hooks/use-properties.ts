import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as propertiesService from "@/features/properties/services/properties-service";
import type { PropertyFormValues } from "@/features/properties/schemas/property-schemas";

export const propertyKeys = {
  all: ["properties"] as const,
  byUser: (userId: number) => ["properties", "user", userId] as const,
  detail: (id: number) => ["properties", "detail", id] as const,
};

export function useProperties(userId: number | null) {
  return useQuery({
    queryKey: propertyKeys.byUser(userId!),
    queryFn: async () => {
      const result = await propertiesService.getProperties(userId!);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!userId,
  });
}

export function useProperty(id: number | null) {
  return useQuery({
    queryKey: propertyKeys.detail(id!),
    queryFn: async () => {
      const result = await propertiesService.getProperty(id!);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!id,
  });
}

export function useCreateProperty(userId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: PropertyFormValues) =>
      propertiesService.createProperty(userId, values),
    onSuccess: (result) => {
      if (!result.error) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.byUser(userId) });
      }
    },
  });
}

export function useUpdateProperty(userId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: PropertyFormValues }) =>
      propertiesService.updateProperty(id, values),
    onSuccess: (result, { id }) => {
      if (!result.error) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.byUser(userId) });
        queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      }
    },
  });
}

export function useDeleteProperty(userId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => propertiesService.deleteProperty(id),
    onSuccess: (result) => {
      if (!result.error) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.byUser(userId) });
      }
    },
  });
}
