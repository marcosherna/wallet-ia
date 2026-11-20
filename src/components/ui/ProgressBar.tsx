import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { useStatusColors } from "../../core/theme/Status";

interface Props {
  /** 0 a 1 (los valores fuera de rango se recortan). */
  value: number;
  /** "auto": verde → amarillo → rojo según el avance (para límites de gasto). */
  tone?: "primary" | "success" | "warning" | "danger" | "auto";
  height?: number;
}

export function ProgressBar({ value, tone = "primary", height = 8 }: Props) {
  const { theme } = useTheme();
  const status = useStatusColors();
  const clamped = Math.max(0, Math.min(1, value));
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: clamped,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped, anim]);

  const color =
    tone === "auto"
      ? value < 0.7
        ? status.success
        : value < 0.9
          ? status.warning
          : status.danger
      : tone === "success"
        ? status.success
        : tone === "warning"
          ? status.warning
          : tone === "danger"
            ? status.danger
            : theme.colors.primary;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={{
        height,
        borderRadius: theme.radii.full,
        backgroundColor: theme.colors.border,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          height: "100%",
          backgroundColor: color,
          borderRadius: theme.radii.full,
          width: anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0%", "100%"],
          }),
        }}
      />
    </View>
  );
}
