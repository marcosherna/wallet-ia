import React from "react";
import { View } from "react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { Button } from "./Button";
import { IconBadge } from "./IconBadge";
import { Label } from "./Label";
import type { IconComponent } from "./types";

interface Props {
  icon: IconComponent;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        padding: theme.spacing.xl,
        gap: theme.spacing.sm,
      }}
    >
      <IconBadge icon={icon} tone="neutral" size={56} />
      <Label size="md" weight="semibold" align="center">
        {title}
      </Label>
      <Label
        size="sm"
        color={theme.colors.textSecondary}
        align="center"
        paragraph
      >
        {description}
      </Label>
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="sm"
          style={{ marginTop: theme.spacing.sm }}
        />
      ) : null}
    </View>
  );
}
