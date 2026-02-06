import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('See documentation: https://github.com/Yan-Sykes/FinanceControl#readme');
  throw new Error('Missing Supabase environment variables. Please check the console for details.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Habilita detecção de sessão na URL para OAuth
    storage: window.localStorage,
    flowType: 'pkce', // Usa PKCE flow para melhor segurança
  },
});
