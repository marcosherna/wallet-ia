import React from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Card, IconBadge, Label, ProgressBar } from "../../../components/ui";
import { useFinance } from "../../../core/hooks/useFinance";
import { monthsUntil } from "../../../core/utils/Finance";
import { GOAL_ICONS } from "../../../core/constants/Categories";

interface Props {
  onPressGoal?: () => void;
}

export function GoalsCarousel({ onPressGoal }: Props) {
  const { theme } = useTheme();
  const { goals, money } = useFinance();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.74, 300);
  const gap = theme.spacing.md;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardWidth + gap}
      decelerationRate="fast"
      // compensa el padding horizontal de la pantalla para que el carrusel llegue al borde
      style={{ marginHorizontal: -theme.spacing.lg }}
      contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, gap }}
    >
      {goals.map((g) => {
        const pct = g.target > 0 ? g.saved / g.target : 0;
        return (
          <Card
            key={g.id}
            onPress={onPressGoal}
            style={{ width: cardWidth, gap: theme.spacing.sm }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.md,
              }}
            >
              <IconBadge icon={GOAL_ICONS[g.icon].icon} />
              <View style={{ flex: 1 }}>
                <Label size="md" weight="semibold" numberOfLines={1}>
                  {g.name}
                </Label>
                <Label size="xs" color={theme.colors.textSecondary}>
                  Faltan {monthsUntil(g.deadline)} meses
                </Label>
              </View>
              <Label size="md" weight="bold" color={theme.colors.primary}>
                {Math.round(pct * 100)}%
              </Label>
            </View>
            <ProgressBar value={pct} />
            <Label size="xs" color={theme.colors.textSecondary}>
              {money(g.saved, { decimals: 0 })} de{" "}
              {money(g.target, { decimals: 0 })}
            </Label>
          </Card>
        );
      })}
    </ScrollView>
  );
}
