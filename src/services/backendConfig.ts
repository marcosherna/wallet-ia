import { isSupabaseConfigured } from "./supabase";

/**
 * Proveedor de base de datos y backend activo.
 * Puede forzarse mediante la variable de entorno:
 * EXPO_PUBLIC_BACKEND_PROVIDER = "supabase" | "firebase" | "auto"
 */
export type BackendProvider = "supabase" | "firebase" | "local";

export const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "";
export const FIREBASE_PROJECT_ID =
  process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "";

export function isFirebaseConfigured(): boolean {
  return (
    Boolean(FIREBASE_API_KEY) &&
    Boolean(FIREBASE_PROJECT_ID) &&
    !FIREBASE_API_KEY.includes("tu-api-key") &&
    FIREBASE_API_KEY.length > 15
  );
}

export function getActiveBackend(): BackendProvider {
  const forced = process.env.EXPO_PUBLIC_BACKEND_PROVIDER?.toLowerCase();
  if (forced === "supabase")
    return isSupabaseConfigured() ? "supabase" : "local";
  if (forced === "firebase")
    return isFirebaseConfigured() ? "firebase" : "local";

  if (isSupabaseConfigured()) return "supabase";
  if (isFirebaseConfigured()) return "firebase";
  return "local";
}

export function getBackendDisplayName(): string {
  const backend = getActiveBackend();
  switch (backend) {
    case "supabase":
      return "Supabase (Nube)";
    case "firebase":
      return "Firebase (Firestore)";
    case "local":
    default:
      return "Modo Local / Demo";
  }
}
