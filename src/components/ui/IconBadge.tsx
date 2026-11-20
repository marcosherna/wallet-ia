import React from "react";
import { View } from "react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { useStatusColors, withAlpha } from "../../core/theme/Status";
import type { IconComponent, Tone } from "./types";
export type { Tone };

export function useToneColor(tone: Tone): string {
  const { theme } = useTheme();
  const s = useStatusColors();
  switch (tone) {
    case "success":
      return s.success;
    case "warning":
      return s.warning;
    case "danger":
      return s.danger;
    case "neutral":
      return theme.colors.textSecondary;
    default:
      return theme.colors.primary;
  }
}

interface Props {
  icon: IconComponent;
  tone?: Tone;
  size?: number;
}

export function IconBadge({ icon: Icon, tone = "primary", size = 40 }: Props) {
  const { theme } = useTheme();
  const color = useToneColor(tone);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: theme.radii.sm + 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          tone === "neutral" ? theme.colors.surface : withAlpha(color, 0.12),
      }}
    >
      <Icon size={Math.round(size * 0.5)} color={color} />
    </View>
  );
}
