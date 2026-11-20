import React from "react";
import { View } from "react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Card, Divider, Label, ProgressBar } from "../../../components/ui";
import { useFinance } from "../../../core/hooks/useFinance";
import { useStatusColors } from "../../../core/theme/Status";

interface RowProps {
  label: string;
  value: number;
  previous: number;
  tone: "success" | "primary";
}

function FlowRow({ label, value, previous, tone }: RowProps) {
  const { theme } = useTheme();
  const { money } = useFinance();
  const ratio = previous > 0 ? value / previous : value > 0 ? 1 : 0;

  return (
    <View style={{ gap: 6 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Label size="sm" color={theme.colors.textSecondary}>
          {label}
        </Label>
        <Label size="md" weight="bold">
          {money(value)}
        </Label>
      </View>
      <ProgressBar value={ratio} tone={tone} />
      <Label size="xs" color={theme.colors.textSecondary}>
        {previous > 0
          ? `${Math.round(ratio * 100)}% de lo registrado el mes pasado (${money(previous, { decimals: 0 })})`
          : "Sin datos del mes pasado"}
      </Label>
    </View>
  );
}

export function CashFlowCard() {
  const { theme } = useTheme();
  const { danger } = useStatusColors();
  const { month, prevMonth, freeToSpend, variableSpent, money } = useFinance();

  const spentRatio = freeToSpend > 0 ? variableSpent / freeToSpend : 1;
  const left = freeToSpend - variableSpent;

  return (
    <Card style={{ gap: theme.spacing.md }}>
      <FlowRow
        label="Ingresos"
        value={month.income}
        previous={prevMonth.income}
        tone="success"
      />
      <FlowRow
        label="Egresos"
        value={month.expenses}
        previous={prevMonth.expenses}
        tone="primary"
      />
      <Divider />
      <View style={{ gap: 6 }}>
        <Label size="sm" color={theme.colors.textSecondary}>
          Dinero libre para gastar
        </Label>
        <Label
          size="xl"
          weight="bold"
          color={left < 0 ? danger : theme.colors.text}
        >
          {money(Math.max(left, 0))}
        </Label>
        <ProgressBar value={spentRatio} tone="auto" />
        <Label size="xs" color={theme.colors.textSecondary} paragraph>
          Ingresos − gastos fijos − ahorro programado ={" "}
          {money(freeToSpend, { decimals: 0 })}. Llevas{" "}
          {money(variableSpent, { decimals: 0 })} en gastos variables.
        </Label>
      </View>
    </Card>
  );
}
