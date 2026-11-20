import React from "react";
import { View } from "react-native";
import { useTheme } from "../../../core/hooks/useTheme";
import { Label } from "../../../components/ui";
interface Props {
  title: string;
  subtitle: string;
}

export function StepHeader({ title, subtitle }: Props) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Label size="xl" weight="bold" heading>
        {title}
      </Label>
      <Label
        size="md"
        paragraph
        color={theme.colors.textSecondary}
        style={{ marginTop: theme.spacing.sm }}
      >
        {subtitle}
      </Label>
    </View>
  );
}
