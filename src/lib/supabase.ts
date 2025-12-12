import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Initialize Supabase once (lazy-load)
 */

const CustomElectronStorage = {
  async getItem(key: string): Promise<string | null> {
    const value = await window.electronAPI?.getItem(key);
    return value ?? null;
  },
  async setItem(key: string, value: string): Promise<void> {
    await window.electronAPI?.setItem(key, value);
  },
  async removeItem(key: string): Promise<void> {
    await window.electronAPI?.removeItem(key);
  },
};
export async function getSupabase(): Promise<SupabaseClient> {
  if (supabaseClient) return supabaseClient;

  // Get environment variables from Electron
  const SUPABASE_URL = await window.electronAPI?.getEnv('SUPABASE_URL');
  const SUPABASE_ANON_KEY = await window.electronAPI?.getEnv('SUPABASE_ANON_KEY');

  const url = SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = SUPABASE_ANON_KEY || 'placeholder-anon-key';
  supabaseClient = createClient(url, key, {
    auth: {
      storage: CustomElectronStorage,
      autoRefreshToken: false,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  return supabaseClient;
}