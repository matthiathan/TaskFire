import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

const getSupabase = (): SupabaseClient => {
  if (supabaseClient) return supabaseClient;

  const url = (import.meta as any).env.VITE_SUPABASE_URL;
  const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

  if (!url || !url.startsWith('http')) {
    return null; // Return null instead of throwing, let the UI handle the missing client
  }

  if (!key || key === 'your-anon-key') {
    return null;
  }

  supabaseClient = createClient(url, key);
  return supabaseClient;
};

// Export a proxy that initializes the client on first access
export const supabase = new Proxy({} as any as SupabaseClient, {
  get(_, prop: string) {
    const client = getSupabase();
    if (!client) {
      // If we don't have a client, return a dummy object or throw a controlled error
      // that we can catch in the UI.
      throw new Error('Supabase configuration missing or invalid.');
    }
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});
