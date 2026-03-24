import { supabase } from '@/lib/supabase';
import { ok, fail, type ServiceResult } from '@/lib/service-result';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';
import type { IncidentFormValues } from '@/features/incidents/schemas/incident-schemas';
import type { IncidentFilters } from '@/features/incidents/types';

export type Incident = Tables<'incidents'>;

// --- Incidents ---

export async function getIncidents(filters?: Partial<IncidentFilters>): Promise<ServiceResult<Incident[]>> {
  let query = supabase
    .from('incidents')
    .select('*')
    .order('date', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }

  const { data, error } = await query;
  if (error) return fail(error.message);
  return ok(data);
}

export async function getIncidentsByProperty(
  propertyId: number,
  filters?: Partial<IncidentFilters>,
): Promise<ServiceResult<Incident[]>> {
  let query = supabase
    .from('incidents')
    .select('*')
    .eq('property_id', propertyId)
    .order('date', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }

  const { data, error } = await query;
  if (error) return fail(error.message);
  return ok(data);
}

export async function getIncident(id: number): Promise<ServiceResult<Incident>> {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return fail(error.message);
  return ok(data);
}

export async function createIncident(
  propertyId: number,
  companyId: number | null,
  values: IncidentFormValues,
): Promise<ServiceResult<Incident>> {
  const payload = {
    property_id: propertyId,
    company_id: companyId,
    title: values.title,
    description: values.description,
    status: values.status,
    ...(values.priority != null && { priority: values.priority }),
    date: values.date,
    cost: values.cost ? Number(values.cost) : null,
  };

  const { data, error } = await supabase
    .from('incidents')
    .insert(payload)
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(data);
}

export async function updateIncident(
  id: number,
  values: Partial<IncidentFormValues> & { companyId?: number },
): Promise<ServiceResult<Incident>> {
  const payload: TablesUpdate<'incidents'> = {
    ...(values.title !== undefined && { title: values.title }),
    ...(values.description !== undefined && { description: values.description }),
    ...(values.status !== undefined && { status: values.status }),
    ...(values.priority !== undefined && { priority: values.priority ?? null }),
    ...(values.date !== undefined && { date: values.date }),
    ...(values.cost !== undefined && { cost: values.cost ? Number(values.cost) : null }),
    ...(values.companyId !== undefined && { company_id: values.companyId }),
  };

  const { data, error } = await supabase
    .from('incidents')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(data);
}

export async function deleteIncident(id: number): Promise<ServiceResult<void>> {
  const { error } = await supabase.from('incidents').delete().eq('id', id);
  if (error) return fail(error.message);
  return ok(undefined);
}
