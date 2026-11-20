import React from "react";
import { Pressable, Switch, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { IconBadge } from "./IconBadge";
import { Label } from "./Label";
import type { IconComponent } from "./types";

interface Props {
  icon: IconComponent;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  toggle?: { value: boolean; onChange: (v: boolean) => void };
}

export function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
  toggle,
}: Props) {
  const { theme } = useTheme();
  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
      }}
    >
      <IconBadge icon={icon} tone="neutral" size={36} />
      <View style={{ flex: 1 }}>
        <Label size="md" weight="medium">
          {title}
        </Label>
        {subtitle ? (
          <Label size="xs" color={theme.colors.textSecondary}>
            {subtitle}
          </Label>
        ) : null}
      </View>
      {toggle ? (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onChange}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {value ? (
            <Label size="sm" color={theme.colors.textSecondary}>
              {value}
            </Label>
          ) : null}
          {onPress ? (
            <ChevronRight size={18} color={theme.colors.textSecondary} />
          ) : null}
        </View>
      )}
    </View>
  );

  return onPress && !toggle ? (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {content}
    </Pressable>
  ) : (
    content
  );
}
