import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://cohcyoddeznlimfojchw.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_CUbMhGCkyvx6GmLxuEfW1A_IH0DLhjN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
