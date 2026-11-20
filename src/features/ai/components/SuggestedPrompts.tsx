import React from "react";
import { Pressable, View } from "react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Label } from "../../../components/ui";
import { SUGGESTED_PROMPTS } from "../aiService";

export function SuggestedPrompts({
  onSelect,
}: {
  onSelect: (text: string) => void;
}) {
  const { theme } = useTheme();
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Label size="sm" weight="semibold" color={theme.colors.textSecondary}>
        Preguntas sugeridas
      </Label>
      {SUGGESTED_PROMPTS.map((p) => (
        <Pressable
          key={p}
          onPress={() => onSelect(p)}
          accessibilityRole="button"
          style={({ pressed }) => ({
            padding: theme.spacing.md,
            borderRadius: theme.radii.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.card,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Label size="sm" weight="medium" paragraph>
            {p}
          </Label>
        </Pressable>
      ))}
    </View>
  );
}
