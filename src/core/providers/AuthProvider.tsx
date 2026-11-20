import React, { useEffect, useState, useCallback, useMemo } from "react";
import { AuthContext, AuthContextValue, AuthUser } from "../contexts/AuthContext";
import { isSupabaseConfigured, supabase } from "../../services/supabase";
import { databaseService } from "../../services/databaseService";
import { FinancialProfile } from "../../features/onboarding/onboarding.data";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] =
    useState<boolean>(false);
  const isSupabaseReady = isSupabaseConfigured();

  // Carga o actualiza el perfil del usuario activo
  const checkProfile = useCallback(async (userId: string, email: string) => {
    try {
      const profile = await databaseService.getProfile(userId);
      if (profile) {
        setUser({
          id: userId,
          email: profile.email || email,
          fullName: profile.fullName || "Usuario",
        });
        setHasCompletedOnboarding(profile.onboardingCompleted);
      } else {
        setUser({
          id: userId,
          email,
          fullName: "Usuario",
        });
        setHasCompletedOnboarding(false);
      }
    } catch {
      setUser({
        id: userId,
        email,
        fullName: "Usuario",
      });
      setHasCompletedOnboarding(false);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseReady) {
      // Modo local/demo por defecto
      setUser({
        id: "demo-user",
        email: "demo@wallet-ia.app",
        fullName: "Usuario Demo",
      });
      setHasCompletedOnboarding(true);
      setIsLoading(false);
      return;
    }

    // Inicializar sesión Supabase existente
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        if (currentSession?.user) {
          checkProfile(
            currentSession.user.id,
            currentSession.user.email || "",
          ).finally(() => setIsLoading(false));
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await checkProfile(newSession.user.id, newSession.user.email || "");
      } else {
        setUser(null);
        setHasCompletedOnboarding(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isSupabaseReady, checkProfile]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      if (!isSupabaseReady) {
        setUser({
          id: "demo-user",
          email,
          fullName: email.split("@")[0] || "Usuario",
        });
        setHasCompletedOnboarding(true);
        return {};
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          return { error: error.message };
        }

        if (data.user) {
          await checkProfile(data.user.id, data.user.email || email);
        }
        return {};
      } catch (e: any) {
        return { error: e?.message || "Error al iniciar sesión." };
      }
    },
    [isSupabaseReady, checkProfile],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName?: string,
    ): Promise<{ error?: string }> => {
      if (!isSupabaseReady) {
        setUser({
          id: "demo-user",
          email,
          fullName: fullName || email.split("@")[0] || "Nuevo Usuario",
        });
        setHasCompletedOnboarding(false);
        return {};
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName || "",
            },
          },
        });

        if (error) {
          return { error: error.message };
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            fullName: fullName || "Nuevo Usuario",
          });
          setHasCompletedOnboarding(false);
        }
        return {};
      } catch (e: any) {
        return { error: e?.message || "Error al registrarse." };
      }
    },
    [isSupabaseReady],
  );

  const loginAsGuest = useCallback(() => {
    setUser({
      id: "demo-user",
      email: "demo@wallet-ia.app",
      fullName: "Usuario Demo",
    });
    setHasCompletedOnboarding(true);
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseReady) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Error signing out:", e);
      }
    }
    setUser(null);
    setSession(null);
    setHasCompletedOnboarding(false);
  }, [isSupabaseReady]);

  const completeOnboarding = useCallback(
    async (profile: FinancialProfile): Promise<boolean> => {
      const activeId = user?.id || "demo-user";
      const success = await databaseService.saveOnboarding(activeId, profile);
      if (success) {
        setHasCompletedOnboarding(true);
      }
      return success;
    },
    [user?.id],
  );

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await checkProfile(user.id, user.email);
    }
  }, [user?.id, user?.email, checkProfile]);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: Boolean(user),
      hasCompletedOnboarding,
      isSupabaseReady,
      signIn,
      signUp,
      loginAsGuest,
      signOut,
      completeOnboarding,
      refreshProfile,
    }),
    [
      user,
      session,
      isLoading,
      hasCompletedOnboarding,
      isSupabaseReady,
      signIn,
      signUp,
      loginAsGuest,
      signOut,
      completeOnboarding,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
