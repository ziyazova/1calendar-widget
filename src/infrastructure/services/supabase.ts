import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

// Fail loudly instead of silently falling back to a placeholder URL —
// a bogus client caused Google OAuth redirects to `example.supabase.co`
// which Chrome blocked with "Unsafe attempt to load URL".
if (!hasSupabaseEnv) {
  const msg = '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check Vercel env vars and redeploy.';
  console.error(msg);
  throw new Error(msg);
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
