import React from "react";
import { View } from "react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { withAlpha } from "../../core/theme/Status";
import { Label } from "./Label";
import { Tone, useToneColor } from "./IconBadge";

interface Props {
  label: string;
  tone?: Tone;
}

export function Badge({ label, tone = "neutral" }: Props) {
  const { theme } = useTheme();
  const color = useToneColor(tone);
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 3,
        borderRadius: theme.radii.full,
        backgroundColor:
          tone === "neutral" ? theme.colors.surface : withAlpha(color, 0.14),
      }}
    >
      <Label size="xs" weight="semibold" color={color}>
        {label}
      </Label>
    </View>
  );
}
