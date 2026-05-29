import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';

if (!config.supabase.url || !config.supabase.serviceKey) {
  console.warn('Missing Supabase credentials. Auth middleware will not work.');
}

// Service role client for backend admin tasks (bypasses RLS)
export const supabaseAdmin = createClient(
  config.supabase.url || 'http://localhost:54321', 
  config.supabase.serviceKey || 'dummy_key'
);
