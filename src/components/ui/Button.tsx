import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { typography } from "../../core/theme/tokens";
import type { IconComponent } from "./types";

type VariantType = "primary" | "secondary" | "outline" | "ghost";
type SizeType = "sm" | "md" | "lg";

interface ButtonProps extends Omit<
  TouchableOpacityProps,
  "style" | "onPress" | "disabled"
> {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: VariantType;
  size?: SizeType;
  fullWidth?: boolean;
  leftIcon?: IconComponent;
  rightIcon?: IconComponent;
  textSize?: keyof typeof typography.sizes;
  textWeight?: keyof typeof typography.weights;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const MIN_HEIGHT: Record<SizeType, number> = { sm: 40, md: 48, lg: 56 };

export function Button({
  title = "Button",
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  textSize,
  textWeight = "semibold",
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const inactive = disabled || loading;

  const containerStyle = (): ViewStyle => {
    if (disabled) {
      return {
        backgroundColor:
          variant === "ghost" ? "transparent" : theme.colors.border,
        borderColor: "transparent",
      };
    }
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: theme.colors.primary,
        };
      case "ghost":
        return { backgroundColor: "transparent", borderColor: "transparent" };
      case "primary":
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.22,
          shadowRadius: 10,
          elevation: 3,
        };
    }
  };

  const contentColor = (): string => {
    if (disabled) return theme.colors.textSecondary;
    switch (variant) {
      case "secondary":
        return theme.colors.text;
      case "outline":
      case "ghost":
        return theme.colors.primary;
      case "primary":
      default:
        return theme.colors.primaryForeground;
    }
  };

  const color = contentColor();
  const resolvedTextSize = textSize ?? (size === "sm" ? "sm" : "md");

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      accessibilityLabel={title}
      activeOpacity={0.75}
      onPress={onPress}
      disabled={inactive}
      style={[
        styles.button,
        {
          minHeight: MIN_HEIGHT[size],
          borderRadius: theme.radii.md,
          paddingHorizontal: theme.spacing.lg,
          gap: theme.spacing.sm,
        },
        fullWidth && styles.fullWidth,
        containerStyle(),
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <>
          {LeftIcon ? <LeftIcon size={18} color={color} /> : null}
          <Text
            style={[
              {
                fontSize: theme.typography.sizes[resolvedTextSize],
                fontWeight: theme.typography.weights[textWeight],
                color,
                textAlign: "center",
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {RightIcon ? <RightIcon size={18} color={color} /> : null}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
});
