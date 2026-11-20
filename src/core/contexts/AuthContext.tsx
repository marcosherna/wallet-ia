import { createContext } from "react";
import { FinancialProfile } from "../../features/onboarding/onboarding.data";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isSupabaseReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
  ) => Promise<{ error?: string }>;
  loginAsGuest: () => void;
  signOut: () => Promise<void>;
  completeOnboarding: (profile: FinancialProfile) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
