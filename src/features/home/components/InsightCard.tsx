import React from "react";
import { View } from "react-native";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
} from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Card, IconBadge, Label } from "../../../components/ui";
import { Insight } from "../../../core/types/Finance";
import { Tone } from "../../../components/ui/types";

const MAP: Record<Insight["tone"], { icon: typeof Sparkles; tone: Tone }> = {
  success: { icon: CheckCircle2, tone: "success" },
  warning: { icon: AlertTriangle, tone: "warning" },
  danger: { icon: AlertTriangle, tone: "danger" },
  info: { icon: Info, tone: "primary" },
};

export function InsightCard({
  insight,
  onPress,
}: {
  insight: Insight;
  onPress?: () => void;
}) {
  const { theme } = useTheme();
  const { icon, tone } = MAP[insight.tone];
  return (
    <Card
      onPress={onPress}
      style={{
        flexDirection: "row",
        gap: theme.spacing.md,
        alignItems: "flex-start",
      }}
    >
      <IconBadge icon={icon} tone={tone} size={36} />
      <View style={{ flex: 1, gap: 2 }}>
        <Label size="md" weight="semibold">
          {insight.title}
        </Label>
        <Label size="sm" color={theme.colors.textSecondary} paragraph>
          {insight.message}
        </Label>
      </View>
    </Card>
  );
}
