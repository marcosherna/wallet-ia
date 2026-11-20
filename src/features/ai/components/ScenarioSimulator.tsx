import React, { useState } from "react";
import { View } from "react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Card, Chip, Label } from "../../../components/ui";
import { useStatusColors } from "../../../core/theme/Status";
import { useFinance } from "../../../core/hooks/useFinance";
import { simulateScenario } from "../../../core/utils/Finance";
import { FieldLabel } from "../../../components/FieldLabel";

const INCOME_STEPS = [0, 5, 10, 20];
const CUT_STEPS = [0, 10, 20, 30];

export function ScenarioSimulator() {
  const { theme } = useTheme();
  const { success } = useStatusColors();
  const { month, prevMonth, goals, money } = useFinance();

  const [boost, setBoost] = useState(10);
  const [cut, setCut] = useState(20);

  const base = month.income || prevMonth.income;
  const discretionary =
    (month.byCategory.leisure ?? 0) + (month.byCategory.subscriptions ?? 0) ||
    (prevMonth.byCategory.leisure ?? 0) +
      (prevMonth.byCategory.subscriptions ?? 0);

  const result = simulateScenario({
    income: base,
    discretionary,
    incomeBoostPct: boost,
    cutPct: cut,
  });

  const goal = goals.find((g) => g.saved < g.target);
  const monthsFaster = (() => {
    if (!goal || goal.monthlyContribution <= 0 || result.monthly <= 0)
      return null;
    const left = goal.target - goal.saved;
    const now = Math.ceil(left / goal.monthlyContribution);
    const later = Math.ceil(left / (goal.monthlyContribution + result.monthly));
    return { name: goal.name, diff: now - later };
  })();

  const group = (
    title: string,
    steps: number[],
    value: number,
    set: (n: number) => void,
  ) => (
    <View>
      <FieldLabel>{title}</FieldLabel>
      <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
        {steps.map((s) => (
          <Chip
            key={s}
            label={s === 0 ? "Sin cambio" : `${s}%`}
            selected={value === s}
            onPress={() => set(s)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ gap: theme.spacing.lg }}>
      <Label size="sm" color={theme.colors.textSecondary} paragraph>
        Estima qué pasaría con tu ahorro si cambias tus ingresos o recortas
        gastos hormiga (ocio y suscripciones).
      </Label>

      <Card style={{ gap: theme.spacing.lg }}>
        {group("Si tus ingresos aumentan", INCOME_STEPS, boost, setBoost)}
        {group("Si recortas gastos hormiga", CUT_STEPS, cut, setCut)}
      </Card>

      <Card variant="muted" style={{ gap: theme.spacing.sm }}>
        <Label size="sm" color={theme.colors.textSecondary}>
          Ahorro adicional estimado
        </Label>
        <Label
          size="xl"
          weight="bold"
          color={result.monthly > 0 ? success : theme.colors.text}
          style={{ fontSize: 30, lineHeight: 36 }}
        >
          {money(result.monthly, { decimals: 0 })} / mes
        </Label>
        <Label size="sm" color={theme.colors.textSecondary}>
          {money(result.yearly, { decimals: 0 })} al año ·{" "}
          {money(result.extraIncome, { decimals: 0 })} por más ingresos y{" "}
          {money(result.saved, { decimals: 0 })} por recortes
        </Label>
        {monthsFaster && monthsFaster.diff > 0 ? (
          <Label size="sm" weight="semibold" paragraph>
            Alcanzarías "{monthsFaster.name}" unos {monthsFaster.diff}{" "}
            {monthsFaster.diff === 1 ? "mes" : "meses"} antes.
          </Label>
        ) : null}
      </Card>
    </View>
  );
}
