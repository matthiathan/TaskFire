import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

const getSupabase = (): SupabaseClient => {
  if (supabaseClient) return supabaseClient;

  const url = (import.meta as any).env.VITE_SUPABASE_URL;
  const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

  if (!url || !url.startsWith('http')) {
    const isDbUrl = url && url.startsWith('postgresql://');
    const errorMsg = !url 
      ? 'VITE_SUPABASE_URL is missing.' 
      : isDbUrl 
        ? 'VITE_SUPABASE_URL is set to a Database URL, but needs the API URL (HTTPS).' 
        : 'VITE_SUPABASE_URL must be a valid URL starting with https://';
      
    throw new Error(`${errorMsg} Please use the "Project URL" from your Supabase API settings.`);
  }

  if (!key || key === 'your-anon-key') {
    throw new Error(
      'VITE_SUPABASE_ANON_KEY is missing or using placeholder value. Please add your real Supabase Anon Key from your project settings.'
    );
  }

  supabaseClient = createClient(url, key);
  return supabaseClient;
};

// Export a proxy that initializes the client on first access
export const supabase = new Proxy({} as any as SupabaseClient, {
  get(_, prop: string) {
    const client = getSupabase();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});
