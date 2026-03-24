import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as incidentsService from "@/features/incidents/services/incidents-service";
import type { IncidentFormValues } from "@/features/incidents/schemas/incident-schemas";
import type { IncidentFilters } from "@/features/incidents/types";

export const incidentKeys = {
  all: ["incidents"] as const,
  list: (filters?: Partial<IncidentFilters>) =>
    ["incidents", "list", filters] as const,
  byProperty: (propertyId: number, filters?: Partial<IncidentFilters>) =>
    ["incidents", "property", propertyId, filters] as const,
  detail: (id: number) => ["incidents", "detail", id] as const,
};

export function useIncidents(filters?: Partial<IncidentFilters>) {
  return useQuery({
    queryKey: incidentKeys.list(filters),
    queryFn: async () => {
      const result = await incidentsService.getIncidents(filters);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
  });
}

export function usePropertyIncidents(
  propertyId: number | null,
  filters?: Partial<IncidentFilters>,
) {
  return useQuery({
    queryKey: incidentKeys.byProperty(propertyId!, filters),
    queryFn: async () => {
      const result = await incidentsService.getIncidentsByProperty(
        propertyId!,
        filters,
      );
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!propertyId,
  });
}

export function useIncident(id: number | null) {
  return useQuery({
    queryKey: incidentKeys.detail(id!),
    queryFn: async () => {
      const result = await incidentsService.getIncident(id!);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!id,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      propertyId,
      companyId,
      values,
    }: {
      propertyId: number;
      companyId: number | null;
      values: IncidentFormValues;
    }) => incidentsService.createIncident(propertyId, companyId, values),
    onSuccess: (result, { propertyId }) => {
      if (!result.error) {
        queryClient.invalidateQueries({ queryKey: incidentKeys.all });
        queryClient.invalidateQueries({
          queryKey: incidentKeys.byProperty(propertyId),
        });
      }
    },
  });
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: Partial<IncidentFormValues> & { companyId?: number };
    }) => incidentsService.updateIncident(id, values),
    onSuccess: (result, { id }) => {
      if (!result.error) {
        queryClient.invalidateQueries({ queryKey: incidentKeys.all });
        queryClient.invalidateQueries({ queryKey: incidentKeys.detail(id) });
      }
    },
  });
}

export function useDeleteIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => incidentsService.deleteIncident(id),
    onSuccess: (result) => {
      if (!result.error) {
        queryClient.invalidateQueries({ queryKey: incidentKeys.all });
      }
    },
  });
}
