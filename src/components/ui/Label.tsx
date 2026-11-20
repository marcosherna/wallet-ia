import React from "react";
import { Text, TextProps, TextStyle, StyleProp } from "react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { typography } from "../../core/theme/tokens";

interface LabelProps extends Omit<TextProps, "style"> {
  children: React.ReactNode;
  size?: keyof typeof typography.sizes;
  weight?: keyof typeof typography.weights;
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  /** Aplica interlineado cómodo para bloques de texto. */
  paragraph?: boolean;
  /** Marca el texto como encabezado para lectores de pantalla. */
  heading?: boolean;
  style?: StyleProp<TextStyle>;
}

export function Label({
  children,
  size = "md",
  weight = "regular",
  color,
  align = "left",
  paragraph = false,
  heading = false,
  style,
  ...rest
}: LabelProps) {
  const { theme } = useTheme();

  return (
    <Text
      accessibilityRole={heading ? "header" : undefined}
      style={[
        {
          fontSize: theme.typography.sizes[size],
          fontWeight: theme.typography.weights[weight],
          color: color ?? theme.colors.text,
          textAlign: align,
          lineHeight: paragraph ? theme.typography.lineHeights.md : undefined,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
