import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * URL y ANON KEY de Supabase.
 * Puedes definirlos en tus variables de entorno (.env):
 * EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
 * EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
 */
export const SUPABASE_URL: string =
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://tu-proyecto.supabase.co";

export const SUPABASE_ANON_KEY: string =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "tu-anon-key-aqui";

/**
 * Comprueba si el proyecto tiene credenciales reales de Supabase configuradas
 */
export function isSupabaseConfigured(): boolean {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    !SUPABASE_URL.includes("tu-proyecto") &&
    SUPABASE_ANON_KEY !== "tu-anon-key-aqui" &&
    SUPABASE_ANON_KEY.length > 20
  );
}

/**
 * Cliente Supabase inicializado con persistencia segura en AsyncStorage
 * compatible con iOS, Android y Web en Expo.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
