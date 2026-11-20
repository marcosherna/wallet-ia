import React from "react";
import { Pressable, View, StyleProp, ViewStyle } from "react-native";

import { useTheme } from "../../core/hooks/useTheme";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "filled" | "muted";
  padded?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  variant = "default",
  padded = true,
  onPress,
  style,
}: CardProps) {
  const { theme } = useTheme();

  const base: ViewStyle = {
    borderRadius: theme.radii.md,
    borderWidth: variant === "filled" ? 0 : 1,
    borderColor: theme.colors.border,
    backgroundColor:
      variant === "filled"
        ? theme.colors.primary
        : variant === "muted"
          ? theme.colors.surface
          : theme.colors.card,
    padding: padded ? theme.spacing.md : 0,
  };

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [base, { opacity: pressed ? 0.88 : 1 }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}
