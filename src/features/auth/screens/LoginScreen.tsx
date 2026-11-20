import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ShieldCheck, CloudOff, Sparkles } from "lucide-react-native";

import { RootStackParamList } from "../../../navigations/types";
import { useTheme } from "../../../core/hooks/useTheme";
import { useStyles } from "../../../core/hooks/useStyles";
import { Button, Input, Label, SegmentedControl } from "../../../components/ui";
import { useAuth } from "../../../core/hooks/useAuth";
import { useStatusColors } from "../../../core/theme/Status";
import {
  getActiveBackend,
  getBackendDisplayName,
} from "../../../services/backendConfig";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;
type AuthMode = "login" | "register";

export default function LoginScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { danger, success } = useStatusColors();
  const { signIn, signUp, loginAsGuest } = useAuth();

  const activeBackend = getActiveBackend();
  const isCloudConnected = activeBackend !== "local";
  const backendLabel = getBackendDisplayName();

  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const styles = useStyles((theme) => ({
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      justifyContent: "center",
      paddingVertical: theme.spacing.xl,
    },
    headerContainer: {
      marginBottom: theme.spacing.lg,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.surface,
      marginBottom: theme.spacing.md,
      gap: 6,
    },
    formContainer: {
      gap: theme.spacing.sm,
    },
    button: {
      marginTop: theme.spacing.md,
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    errorBox: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      padding: theme.spacing.sm,
      borderRadius: theme.radii.sm,
      borderWidth: 1,
      borderColor: "rgba(239, 68, 68, 0.3)",
      marginBottom: theme.spacing.xs,
    },
  }));

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Por favor ingresa tu correo y contraseña.");
      return;
    }

    if (mode === "register" && !fullName.trim()) {
      setErrorMessage("Por favor ingresa tu nombre completo.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const result = await signIn(email, password);
        if (result.error) {
          setErrorMessage(result.error);
        } else {
          navigation.replace("MainApp", {
            screen: "MainTabs",
            params: { screen: "Home" },
          });
        }
      } else {
        const result = await signUp(email, password, fullName);
        if (result.error) {
          setErrorMessage(result.error);
        } else {
          Alert.alert(
            "Cuenta creada",
            "Tu cuenta ha sido creada exitosamente. Completemos tu perfil financiero.",
          );
          navigation.replace("Onboarding");
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    navigation.replace("MainApp", {
      screen: "MainTabs",
      params: { screen: "Home" },
    });
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      bottomOffset={20}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Indicador de estado de la base de datos */}
        <View style={styles.statusBadge}>
          {isCloudConnected ? (
            <>
              <ShieldCheck size={14} color={success} />
              <Label size="xs" color={success} weight="semibold">
                {backendLabel} Conectado
              </Label>
            </>
          ) : (
            <>
              <CloudOff size={14} color={theme.colors.textSecondary} />
              <Label size="xs" color={theme.colors.textSecondary}>
                Modo Local / Demo
              </Label>
            </>
          )}
        </View>

        <View style={styles.headerContainer}>
          <Label size="heading" weight="bold">
            {mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </Label>
          <Label
            size="md"
            weight="regular"
            color={theme.colors.textSecondary}
            paragraph
          >
            {mode === "login"
              ? "Gestiona tus finanzas personales y consulta con tu asesor IA"
              : "Comienza a optimizar tus ahorros y metas financieras"}
          </Label>
        </View>

        <SegmentedControl
          options={[
            { id: "login" as AuthMode, label: "Iniciar sesión" },
            { id: "register" as AuthMode, label: "Registrarse" },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            setErrorMessage("");
          }}
        />

        <View style={[styles.formContainer, { marginTop: theme.spacing.md }]}>
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Label size="xs" color={danger} weight="medium">
                {errorMessage}
              </Label>
            </View>
          ) : null}

          {mode === "register" && (
            <Input
              label="Nombre completo"
              placeholder="Ej. Carlos Mendoza"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          )}

          <Input
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showTogglePassword
          />

          <Button
            title={mode === "login" ? "Ingresar" : "Crear cuenta"}
            onPress={handleSubmit}
            loading={loading}
            variant="primary"
            style={styles.button}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Label size="xs" color={theme.colors.textSecondary}>
              o continúa sin registrarte
            </Label>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Entrar en Modo Demo / Invitado"
            variant="outline"
            leftIcon={Sparkles}
            onPress={handleGuest}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
