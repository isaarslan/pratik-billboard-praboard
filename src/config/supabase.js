import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://cohcyoddeznlimfojchw.supabase.co').trim();
const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvaGN5b2RkZXpubGltZm9qY2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzMxMDksImV4cCI6MjA4NzEwOTEwOX0.oiFTgsUOVmCvb8jVCaeEgDvZXuhkUM4YAl30Fx9ta4U').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
    heartbeatIntervalMs: 30000,
    reconnectAfterMs: (tries) => Math.min(tries * 2000, 30000),
  },
});
export default supabase;
