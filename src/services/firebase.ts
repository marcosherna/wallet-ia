/**
 * Configuración de Firebase para Wallet IA.
 * 
 * Si decides usar Firebase / Cloud Firestore en lugar de Supabase:
 * 1. Instala el SDK de Firebase en tu proyecto:
 *    npx expo install firebase
 * 
 * 2. Agrega tus credenciales a tu archivo `.env`:
 *    EXPO_PUBLIC_BACKEND_PROVIDER=firebase
 *    EXPO_PUBLIC_FIREBASE_API_KEY=tu-api-key
 *    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
 *    EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
 *    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
 *    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
 *    EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
 * 
 * 3. En la consola de Firebase, activa:
 *    - Authentication (Email/Password)
 *    - Cloud Firestore (copia las reglas de `src/services/firestore.rules`)
 */

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
};
