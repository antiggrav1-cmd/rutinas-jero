import { createClient } from '@supabase/supabase-js';

// Reemplazarás estos valores con las claves públicas que Supabase te entregará al crear tu proyecto gratuito en supabase.com
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
