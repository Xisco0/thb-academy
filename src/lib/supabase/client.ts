import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qsshjpvllwplgaaqanwi.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_CFQdv-hYVMYwcNbSl2p9Jg_Q-4jQ9bT';

  return createBrowserClient(supabaseUrl, anonKey);
}
