import React from "react";
import { Pressable, View } from "react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { Label } from "./Label";

interface Props {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Label size="md" weight="bold" heading>
        {title}
      </Label>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Label size="sm" weight="semibold" color={theme.colors.primary}>
            {actionLabel}
          </Label>
        </Pressable>
      ) : null}
    </View>
  );
}
