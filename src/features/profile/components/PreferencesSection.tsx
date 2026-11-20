import React, { useState } from "react";
import { View } from "react-native";
import { Bell, Coins, Fingerprint, Lock, Moon } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import {
  Card,
  Divider,
  Label,
  SegmentedControl,
  SettingRow,
} from "../../../components/ui";
import { CurrencySheet } from "./CurrencySheet";
import { useFinance } from "../../../core/hooks/useFinance";
import { ThemeMode } from "../../../core/contexts/ThemeContext";

/** Moneda, seguridad, apariencia y notificaciones. */
export function PreferencesSection() {
  const { theme } = useTheme();
  const { preferences, setPreferences } = useFinance();
  const [currencyOpen, setCurrencyOpen] = useState(false);

  // Adapta esta función al método que expone tu useTheme (setMode, setThemeMode, toggleTheme…).
  const themeCtx = useTheme() as unknown as {
    setThemeMode?: (m: ThemeMode) => void;
    setMode?: (m: ThemeMode) => void;
  };
  const changeTheme = (mode: ThemeMode) => {
    setPreferences({ themeMode: mode });
    (themeCtx.setThemeMode ?? themeCtx.setMode)?.(mode);
  };

  return (
    <View style={{ gap: theme.spacing.md }}>
      <Card style={{ paddingVertical: theme.spacing.xs }}>
        <SettingRow
          icon={Coins}
          title="Moneda"
          value={preferences.currency}
          onPress={() => setCurrencyOpen(true)}
        />
        <Divider />
        <SettingRow
          icon={Bell}
          title="Notificaciones"
          subtitle="Alertas de pagos y límites de gasto"
          toggle={{
            value: preferences.notifications,
            onChange: (v) => setPreferences({ notifications: v }),
          }}
        />
      </Card>

      <Card style={{ paddingVertical: theme.spacing.xs }}>
        <SettingRow
          icon={Fingerprint}
          title="Biometría"
          subtitle="Huella o rostro para abrir la app"
          toggle={{
            value: preferences.biometrics,
            onChange: (v) => setPreferences({ biometrics: v }),
          }}
        />
        <Divider />
        <SettingRow
          icon={Lock}
          title="PIN de acceso"
          subtitle="Código de respaldo de 4 dígitos"
          toggle={{
            value: preferences.pinEnabled,
            onChange: (v) => setPreferences({ pinEnabled: v }),
          }}
        />
      </Card>

      <Card style={{ gap: theme.spacing.sm }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          <Moon size={18} color={theme.colors.textSecondary} />
          <Label size="md" weight="medium">
            Apariencia
          </Label>
        </View>
        <SegmentedControl
          options={[
            { id: "light" as ThemeMode, label: "Claro" },
            { id: "dark" as ThemeMode, label: "Oscuro" },
            { id: "system" as ThemeMode, label: "Sistema" },
          ]}
          value={preferences.themeMode}
          onChange={changeTheme}
        />
      </Card>

      <CurrencySheet
        visible={currencyOpen}
        onClose={() => setCurrencyOpen(false)}
      />
    </View>
  );
}
