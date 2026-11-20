import React from "react";
import { View } from "react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Card, IconBadge, Label, ProgressBar } from "../../../components/ui";
import { CategoryBudget } from "../../../core/types/Finance";
import { useStatusColors } from "../../../core/theme/Status";
import { useFinance } from "../../../core/hooks/useFinance";
import { CATEGORIES } from "../../../core/constants/Categories";

interface Props {
  budget: CategoryBudget;
  onPress: (b: CategoryBudget) => void;
}

export function BudgetCard({ budget, onPress }: Props) {
  const { theme } = useTheme();
  const { danger, warning } = useStatusColors();
  const { month, money } = useFinance();

  const spent = month.byCategory[budget.categoryId] ?? 0;
  const ratio = spent / budget.limit;
  const over = spent > budget.limit;
  const color = over
    ? danger
    : ratio >= 0.7
      ? warning
      : theme.colors.textSecondary;

  return (
    <Card onPress={() => onPress(budget)} style={{ gap: theme.spacing.md }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.md,
        }}
      >
        <IconBadge
          icon={CATEGORIES[budget.categoryId].icon}
          tone={over ? "danger" : ratio >= 0.7 ? "warning" : "neutral"}
        />
        <View style={{ flex: 1 }}>
          <Label size="md" weight="bold">
            {CATEGORIES[budget.categoryId].label}
          </Label>
          <Label size="xs" color={theme.colors.textSecondary}>
            Tope mensual: {money(budget.limit, { decimals: 0 })}
          </Label>
        </View>
        <Label size="md" weight="bold">
          {Math.round(ratio * 100)}%
        </Label>
      </View>
      <ProgressBar value={ratio} tone="auto" />
      <Label size="sm" weight="medium" color={color}>
        {over
          ? `Excedido por ${money(spent - budget.limit)}`
          : `Has gastado ${money(spent)} · te quedan ${money(budget.limit - spent)}`}
      </Label>
    </Card>
  );
}
