import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import {
  Bell,
  Coins,
  Database,
  Fingerprint,
  Lock,
  LogOut,
  Moon,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../../../core/hooks/useTheme";
import {
  Button,
  Card,
  Divider,
  Label,
  ScreenContainer,
  SectionHeader,
  SettingRow,
} from "../../../components/ui";
import { CurrencySheet } from "../../profile/components/CurrencySheet";
import { useFinance } from "../../../core/hooks/useFinance";
import { useAuth } from "../../../core/hooks/useAuth";
import { useStatusColors } from "../../../core/theme/Status";
import { ThemeMode } from "../../../core/contexts/ThemeContext";
import {
  getActiveBackend,
  getBackendDisplayName,
} from "../../../services/backendConfig";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { danger, success } = useStatusColors();
  const navigation = useNavigation<any>();

  const { preferences, setPreferences, isSyncing, refresh } = useFinance();
  const { user, signOut } = useAuth();
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const activeBackend = getActiveBackend();
  const backendLabel = getBackendDisplayName();
  const isCloudConnected = activeBackend !== "local";

  const themeCtx = useTheme() as unknown as {
    setThemeMode?: (m: ThemeMode) => void;
    setMode?: (m: ThemeMode) => void;
  };

  const changeTheme = (mode: ThemeMode) => {
    setPreferences({ themeMode: mode });
    (themeCtx.setThemeMode ?? themeCtx.setMode)?.(mode);
  };

  const handleSync = async () => {
    await refresh();
    Alert.alert(
      "Sincronización completada",
      "Tus datos de finanzas, cuentas y metas están al día con la nube.",
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar tu sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await signOut();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer
      title="Ajustes"
      subtitle="Configuración de la cuenta y la aplicación"
    >
      {/* Información del usuario */}
      <View style={{ gap: theme.spacing.sm }}>
        <SectionHeader title="Cuenta" />
        <Card>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.md,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: theme.colors.surface,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={24} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Label size="md" weight="bold">
                {user?.fullName || "Usuario"}
              </Label>
              <Label size="sm" color={theme.colors.textSecondary}>
                {user?.email || "Sin correo"}
              </Label>
            </View>
          </View>
        </Card>
      </View>

      {/* Estado del Backend / Base de Datos */}
      <View style={{ gap: theme.spacing.sm }}>
        <SectionHeader title="Base de Datos y Nube" />
        <Card style={{ paddingVertical: theme.spacing.xs }}>
          <SettingRow
            icon={Database}
            title="Servicio de Datos"
            subtitle={
              isCloudConnected
                ? `Conectado a ${backendLabel}`
                : "Modo Local / Demo activo (Sin credenciales en .env)"
            }
            value={isCloudConnected ? "Conectado" : "Local"}
          />
          <Divider />
          <SettingRow
            icon={RefreshCw}
            title="Sincronizar Datos"
            subtitle={
              isSyncing
                ? "Sincronizando con la nube..."
                : "Recargar saldos, presupuestos, metas y transacciones"
            }
            onPress={handleSync}
          />
        </Card>
      </View>

      {/* Preferencias Financieras */}
      <View style={{ gap: theme.spacing.sm }}>
        <SectionHeader title="Preferencias de la App" />
        <Card style={{ paddingVertical: theme.spacing.xs }}>
          <SettingRow
            icon={Coins}
            title="Moneda principal"
            value={preferences.currency}
            onPress={() => setCurrencyOpen(true)}
          />
          <Divider />
          <SettingRow
            icon={Moon}
            title="Tema oscuro"
            subtitle="Alternar entre modo claro y oscuro"
            toggle={{
              value: preferences.themeMode === "dark",
              onChange: (isDark) => changeTheme(isDark ? "dark" : "light"),
            }}
          />
          <Divider />
          <SettingRow
            icon={Bell}
            title="Notificaciones push"
            subtitle="Alertas de presupuestos y metas"
            toggle={{
              value: preferences.notifications,
              onChange: (v) => setPreferences({ notifications: v }),
            }}
          />
        </Card>
      </View>

      {/* Seguridad */}
      <View style={{ gap: theme.spacing.sm }}>
        <SectionHeader title="Seguridad" />
        <Card style={{ paddingVertical: theme.spacing.xs }}>
          <SettingRow
            icon={Fingerprint}
            title="Biometría / FaceID"
            subtitle="Solicitar huella o rostro al abrir"
            toggle={{
              value: preferences.biometrics,
              onChange: (v) => setPreferences({ biometrics: v }),
            }}
          />
          <Divider />
          <SettingRow
            icon={Lock}
            title="Bloqueo con PIN"
            subtitle="Pedir código numérico de 4 dígitos"
            toggle={{
              value: preferences.pinEnabled,
              onChange: (v) => setPreferences({ pinEnabled: v }),
            }}
          />
        </Card>
      </View>

      {/* Sesión */}
      <Button
        title="Cerrar sesión"
        variant="ghost"
        leftIcon={LogOut}
        textStyle={{ color: danger }}
        onPress={handleSignOut}
      />

      <CurrencySheet
        visible={currencyOpen}
        current={preferences.currency}
        onSelect={(currency) => setPreferences({ currency })}
        onClose={() => setCurrencyOpen(false)}
      />
    </ScreenContainer>
  );
}
