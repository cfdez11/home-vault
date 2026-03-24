import { supabase } from '@/lib/supabase';
import { ok, fail, type ServiceResult } from '@/lib/service-result';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';
import type { PropertyFormValues, DocumentFormValues } from '@/features/properties/schemas/property-schemas';

export type Property = Tables<'properties'>;
export type Document = Tables<'documents'>;

export type PropertyWithCounts = Property & {
  incidentCount: number;
  documentCount: number;
};

// --- Properties ---

export async function getProperties(userId: number): Promise<ServiceResult<PropertyWithCounts[]>> {
  const { data, error } = await supabase
    .from('properties')
    .select('*, incidents(count), documents(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return fail(error.message);

  const mapped: PropertyWithCounts[] = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    type: row.type,
    size: row.size,
    year: row.year,
    user_id: row.user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    incidentCount: (row.incidents as unknown as [{ count: number }])[0]?.count ?? 0,
    documentCount: (row.documents as unknown as [{ count: number }])[0]?.count ?? 0,
  }));

  return ok(mapped);
}

export async function getProperty(id: number): Promise<ServiceResult<Property>> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return fail(error.message);
  return ok(data);
}

export async function createProperty(
  userId: number,
  values: PropertyFormValues,
): Promise<ServiceResult<Property>> {
  const payload: TablesInsert<'properties'> = {
    user_id: userId,
    name: values.name,
    address: values.address,
    type: values.type ?? null,
    size: values.size ? Number(values.size) : null,
    year: values.year ? Number(values.year) : null,
  };

  const { data, error } = await supabase
    .from('properties')
    .insert(payload)
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(data);
}

export async function updateProperty(
  id: number,
  values: PropertyFormValues,
): Promise<ServiceResult<Property>> {
  const payload: TablesUpdate<'properties'> = {
    name: values.name,
    address: values.address,
    type: values.type ?? null,
    size: values.size ? Number(values.size) : null,
    year: values.year ? Number(values.year) : null,
  };

  const { data, error } = await supabase
    .from('properties')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(data);
}

export async function deleteProperty(id: number): Promise<ServiceResult<void>> {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) return fail(error.message);
  return ok(undefined);
}

// --- Documents ---

export async function getDocuments(propertyId: number): Promise<ServiceResult<Document[]>> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('property_id', propertyId)
    .order('date', { ascending: false });

  if (error) return fail(error.message);
  return ok(data);
}

export async function createDocument(
  propertyId: number,
  values: DocumentFormValues,
): Promise<ServiceResult<Document>> {
  const payload: TablesInsert<'documents'> = {
    property_id: propertyId,
    title: values.title,
    type: values.type,
    date: values.date,
    url: values.url,
    notes: values.notes || null,
  };

  const { data, error } = await supabase
    .from('documents')
    .insert(payload)
    .select()
    .single();

  if (error) return fail(error.message);
  return ok(data);
}

export async function deleteDocument(id: number): Promise<ServiceResult<void>> {
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) return fail(error.message);
  return ok(undefined);
}
