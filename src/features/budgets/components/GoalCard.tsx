import React from "react";
import { View } from "react-native";
import { PiggyBank, Trash2 } from "lucide-react-native";

import {
  Badge,
  Button,
  Card,
  IconBadge,
  Label,
  ProgressBar,
} from "../../../components/ui";
import { Goal } from "../../../core/types/Finance";
import { useTheme } from "../../../core/hooks/useTheme";
import { useFinance } from "../../../core/hooks/useFinance";
import { GOAL_ICONS } from "../../../core/constants/Categories";
import { formatShortDate } from "../../../core/utils/Format";
import { monthsUntil } from "../../../core/utils/Finance";
import { useStatusColors } from "../../../core/theme/Status";

interface Props {
  goal: Goal;
  onContribute: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
}

export function GoalCard({ goal, onContribute, onDelete }: Props) {
  const { theme } = useTheme();
  const { danger } = useStatusColors();
  const { money } = useFinance();
  const pct = goal.target > 0 ? goal.saved / goal.target : 0;
  const done = goal.saved >= goal.target;

  return (
    <Card style={{ gap: theme.spacing.md }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.md,
        }}
      >
        <IconBadge icon={GOAL_ICONS[goal.icon]?.icon ?? GOAL_ICONS.target.icon} />
        <View style={{ flex: 1 }}>
          <Label size="md" weight="bold" numberOfLines={1}>
            {goal.name}
          </Label>
          <Label size="xs" color={theme.colors.textSecondary}>
            Meta para {formatShortDate(goal.deadline)} ·{" "}
            {monthsUntil(goal.deadline)} meses
          </Label>
        </View>
        {done ? (
          <Badge label="Lograda" tone="success" />
        ) : (
          <Label size="md" weight="bold" color={theme.colors.primary}>
            {Math.round(pct * 100)}%
          </Label>
        )}
      </View>

      <View style={{ gap: 6 }}>
        <ProgressBar value={pct} tone={done ? "success" : "primary"} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Label size="sm" weight="semibold">
            {money(goal.saved, { decimals: 0 })}
          </Label>
          <Label size="sm" color={theme.colors.textSecondary}>
            de {money(goal.target, { decimals: 0 })}
          </Label>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Label size="xs" color={theme.colors.textSecondary}>
          Programado: {money(goal.monthlyContribution, { decimals: 0 })}/mes
        </Label>
        <View style={{ flexDirection: "row", gap: theme.spacing.xs, alignItems: "center" }}>
          {onDelete && (
            <Button
              title=""
              size="sm"
              variant="ghost"
              leftIcon={Trash2}
              textStyle={{ color: danger }}
              onPress={() => onDelete(goal)}
            />
          )}
          {!done && (
            <Button
              title="Abonar"
              size="sm"
              variant="outline"
              leftIcon={PiggyBank}
              onPress={() => onContribute(goal)}
            />
          )}
        </View>
      </View>
    </Card>
  );
}
