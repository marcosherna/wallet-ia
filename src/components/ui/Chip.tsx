import React from "react";
import { Pressable } from "react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { Label } from "./Label";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

/** Píldora de selección rápida (atajos de valores, filtros). */
export function Chip({ label, selected = false, onPress }: ChipProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => ({
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.radii.full,
        borderWidth: 1,
        borderColor: selected ? theme.colors.primary : theme.colors.border,
        backgroundColor: selected ? theme.colors.primary : theme.colors.card,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Label
        size="sm"
        weight="semibold"
        color={selected ? theme.colors.primaryForeground : theme.colors.text}
      >
        {label}
      </Label>
    </Pressable>
  );
}
