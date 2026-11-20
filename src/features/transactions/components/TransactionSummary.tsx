import React from "react";
import { View } from "react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Card, Label } from "../../../components/ui";
import { useStatusColors } from "../../../core/theme/Status";
import { useFinance } from "../../../core/hooks/useFinance";
import { Transaction } from "../../../core/types/Finance";

export function TransactionSummary({ items }: { items: Transaction[] }) {
  const { theme } = useTheme();
  const { success } = useStatusColors();
  const { money } = useFinance();

  const income = items
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expense = items
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <Card
      variant="muted"
      style={{ flexDirection: "row", gap: theme.spacing.md }}
    >
      <View style={{ flex: 1 }}>
        <Label size="xs" color={theme.colors.textSecondary}>
          Ingresos
        </Label>
        <Label size="md" weight="bold" color={success}>
          {money(income)}
        </Label>
      </View>
      <View style={{ flex: 1 }}>
        <Label size="xs" color={theme.colors.textSecondary}>
          Egresos
        </Label>
        <Label size="md" weight="bold">
          {money(expense)}
        </Label>
      </View>
      <View style={{ flex: 1 }}>
        <Label size="xs" color={theme.colors.textSecondary}>
          Movimientos
        </Label>
        <Label size="md" weight="bold">
          {items.length}
        </Label>
      </View>
    </Card>
  );
}
