import type { CompanyFormValues } from '@/features/companies/schemas/company-schemas';
import { fail, ok, type ServiceResult } from '@/lib/service-result';
import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';

export type Company = Tables<'companies'>;

export type CompanyIncident = {
  id: number;
  title: string;
  status: 'open' | 'in_progress' | 'resolved';
};

export type CompanyWithDetails = Company & {
  categories: string[];
  pendingIncidents: number;
  recentIncidents: CompanyIncident[];
};

// --- Companies ---

export async function getCompanies(): Promise<ServiceResult<CompanyWithDetails[]>> {
  const { data, error } = await supabase
    .from('companies')
    .select('*, company_categories(categories(id, category_name)), incidents(id, title, status)')
    .order('name', { ascending: true });

  if (error) return fail(error.message);

  const mapped: CompanyWithDetails[] = (data ?? []).map((row) => {
    const categories = (
      (row.company_categories ?? []) as { categories: { id: number; category_name: string } | null }[]
    )
      .map((cc) => cc.categories?.category_name)
      .filter((name): name is string => !!name);

    const incidents = ((row.incidents ?? []) as CompanyIncident[]);
    const pendingIncidents = incidents.filter((i) => i.status !== 'resolved').length;
    const recentIncidents = incidents.slice(0, 5);

    return {
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      categories,
      pendingIncidents,
      recentIncidents,
    };
  });

  return ok(mapped);
}

export async function getCompany(id: number): Promise<ServiceResult<Company>> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return fail(error.message);
  return ok(data);
}

export async function getCompanyWithDetails(id: number): Promise<ServiceResult<CompanyWithDetails>> {
  const { data, error } = await supabase
    .from('companies')
    .select('*, company_categories(categories(id, category_name)), incidents(id, title, status)')
    .eq('id', id)
    .single();

  if (error) return fail(error.message);

  const categories = (
    (data.company_categories ?? []) as { categories: { id: number; category_name: string } | null }[]
  )
    .map((cc) => cc.categories?.category_name)
    .filter((name): name is string => !!name);

  const incidents = ((data.incidents ?? []) as CompanyIncident[]);

  return ok({
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    categories,
    pendingIncidents: incidents.filter((i) => i.status !== 'resolved').length,
    recentIncidents: incidents.slice(0, 5),
  });
}

export async function createCompany(
  values: CompanyFormValues,
): Promise<ServiceResult<Company>> {
  const payload: TablesInsert<'companies'> = {
    name: values.name,
    phone: values.phone || null,
    email: values.email || null,
  };

  const { data, error } = await supabase
    .from('companies')
    .insert(payload)
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(data);
}

export async function updateCompany(
  id: number,
  values: CompanyFormValues,
): Promise<ServiceResult<Company>> {
  const payload: TablesUpdate<'companies'> = {
    name: values.name,
    phone: values.phone || null,
    email: values.email || null,
  };

  const { data, error } = await supabase
    .from('companies')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(data);
}

export async function deleteCompany(id: number): Promise<ServiceResult<void>> {
  const { error } = await supabase.from('companies').delete().eq('id', id);
  if (error) return fail(error.message);
  return ok(undefined);
}
