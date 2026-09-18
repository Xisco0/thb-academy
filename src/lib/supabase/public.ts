import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import 'server-only';

/**
 * Static, cookie-free Supabase client for public read-only content.
 * Features 5-second fetch timeouts to prevent build workers from hanging.
 * Prevents Next.js from marking public pages as dynamic (DYNAMIC_SERVER_USAGE).
 * Allows Vercel CDN to cache rendered public pages at the Edge.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase public configuration');
  }

  return createSupabaseClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(5000), // 5-second network timeout per query
        });
      },
    },
  });
}
