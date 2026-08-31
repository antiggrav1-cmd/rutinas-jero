import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqthchozxcieinphdhqb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_A05S1TzgdwhByFNoaQNpBA_eWK-azCl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
