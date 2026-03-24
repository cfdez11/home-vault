import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/auth-context';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/supabase';

export type UserRecord = Tables<'users'>;

export function useCurrentUser() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['currentUser', session?.user.email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', session!.user.email!)
        .single();
      if (error) throw new Error(error.message);
      return data as UserRecord;
    },
    enabled: !!session?.user.email,
  });
}
