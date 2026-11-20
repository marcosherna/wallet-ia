import React from "react";
import { Pressable, View } from "react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { Label } from "./Label";

interface Option<T extends string> {
  id: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (id: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  const { theme } = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        padding: 4,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.surface,
      }}
    >
      {options.map((o) => {
        const selected = o.id === value;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              minHeight: 38,
              borderRadius: theme.radii.sm + 2,
              backgroundColor: selected ? theme.colors.card : "transparent",
              borderWidth: selected ? 1 : 0,
              borderColor: theme.colors.border,
            }}
          >
            <Label
              size="sm"
              weight={selected ? "semibold" : "medium"}
              color={selected ? theme.colors.text : theme.colors.textSecondary}
            >
              {o.label}
            </Label>
          </Pressable>
        );
      })}
    </View>
  );
}
