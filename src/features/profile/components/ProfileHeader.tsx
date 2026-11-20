import React from "react";
import { View } from "react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Card, Label } from "../../../components/ui";
import { useFinance } from "../../../core/hooks/useFinance";

interface Props {
  name: string;
  email: string;
}

export function ProfileHeader({ name, email }: Props) {
  const { theme } = useTheme();
  const { accounts, goals, loans } = useFinance();

  const stat = (value: number, label: string) => (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Label size="md" weight="bold">
        {value}
      </Label>
      <Label size="xs" color={theme.colors.textSecondary}>
        {label}
      </Label>
    </View>
  );

  return (
    <Card style={{ gap: theme.spacing.md }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.md,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.primary,
          }}
        >
          <Label size="xl" weight="bold" color={theme.colors.primaryForeground}>
            {name.charAt(0).toUpperCase()}
          </Label>
        </View>
        <View style={{ flex: 1 }}>
          <Label size="md" weight="bold">
            {name}
          </Label>
          <Label size="sm" color={theme.colors.textSecondary}>
            {email}
          </Label>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        {stat(accounts.length, "Cuentas")}
        {stat(goals.length, "Metas")}
        {stat(loans.length, "Créditos")}
      </View>
    </Card>
  );
}
