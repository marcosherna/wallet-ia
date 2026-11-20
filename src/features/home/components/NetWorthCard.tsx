import React from "react";
import { View } from "react-native";
import { TrendingDown, TrendingUp } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Card, Label } from "../../../components/ui";
import { useFinance } from "../../../core/hooks/useFinance";
import { withAlpha } from "../../../core/theme/Status";

export function NetWorthCard() {
  const { theme } = useTheme();
  const { netWorth, assets, liabilities, month, money } = useFinance();

  const fg = theme.colors.primaryForeground;
  const muted = withAlpha(fg, 0.75);
  const flow = month.income - month.expenses;
  const Trend = flow >= 0 ? TrendingUp : TrendingDown;

  return (
    <Card variant="filled" style={{ gap: theme.spacing.md }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Label size="sm" weight="medium" color={muted}>
          Patrimonio neto
        </Label>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: 4,
            borderRadius: theme.radii.full,
            backgroundColor: withAlpha(fg, 0.18),
          }}
        >
          <Trend size={14} color={fg} />
          <Label size="xs" weight="semibold" color={fg}>
            {money(flow, { sign: true, decimals: 0 })} este mes
          </Label>
        </View>
      </View>

      <Label
        size="xl"
        weight="bold"
        color={fg}
        style={{ fontSize: 34, lineHeight: 40 }}
      >
        {money(netWorth)}
      </Label>

      <View style={{ flexDirection: "row", gap: theme.spacing.lg }}>
        <View style={{ flex: 1 }}>
          <Label size="xs" color={muted}>
            Activos líquidos
          </Label>
          <Label size="md" weight="semibold" color={fg}>
            {money(assets)}
          </Label>
        </View>
        <View style={{ width: 1, backgroundColor: withAlpha(fg, 0.25) }} />
        <View style={{ flex: 1 }}>
          <Label size="xs" color={muted}>
            Pasivos
          </Label>
          <Label size="md" weight="semibold" color={fg}>
            {money(liabilities)}
          </Label>
        </View>
      </View>
    </Card>
  );
}
