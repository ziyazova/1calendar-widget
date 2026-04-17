import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseEnv) {
  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Running in fallback mode — auth actions will fail.');
}

// Prevent runtime crash (white screen) when env vars are missing in production.
// Fallback client keeps app bootable; auth/storage calls will simply fail gracefully.
const fallbackUrl = 'https://example.supabase.co';
const fallbackAnonKey = 'public-anon-key';

export const supabase = createClient(
  hasSupabaseEnv ? supabaseUrl! : fallbackUrl,
  hasSupabaseEnv ? supabaseAnonKey! : fallbackAnonKey,
);
