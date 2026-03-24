/**
 * Generic result type for all service operations.
 * Services never throw — they always return a typed result.
 */
export type ServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export function ok<T>(data: T): ServiceResult<T> {
  return { data, error: null };
}

export function fail<T = never>(error: string): ServiceResult<T> {
  return { data: null, error };
}
