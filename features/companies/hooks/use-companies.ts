import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as companiesService from "@/features/companies/services/companies-service";
import type { CompanyFormValues } from "@/features/companies/schemas/company-schemas";

export const companyKeys = {
  all: ["companies"] as const,
  list: () => ["companies", "list"] as const,
  detail: (id: number) => ["companies", "detail", id] as const,
};

export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.list(),
    queryFn: async () => {
      const result = await companiesService.getCompanies();
      if (result.error) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useCompany(id: number | null) {
  return useQuery({
    queryKey: companyKeys.detail(id!),
    queryFn: async () => {
      const result = await companiesService.getCompanyWithDetails(id!);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CompanyFormValues) =>
      companiesService.createCompany(values),
    onSuccess: (result) => {
      if (!result.error) {
        queryClient.invalidateQueries({ queryKey: companyKeys.list() });
      }
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: CompanyFormValues }) =>
      companiesService.updateCompany(id, values),
    onSuccess: (result, { id }) => {
      if (!result.error) {
        queryClient.invalidateQueries({ queryKey: companyKeys.list() });
        queryClient.invalidateQueries({ queryKey: companyKeys.detail(id) });
      }
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => companiesService.deleteCompany(id),
    onSuccess: (result) => {
      if (!result.error) {
        queryClient.invalidateQueries({ queryKey: companyKeys.list() });
      }
    },
  });
}
