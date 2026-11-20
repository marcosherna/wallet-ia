import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { Label } from "./Label";
import type { IconComponent } from "./types";

interface OptionCardProps {
  title: string;
  description?: string;
  icon?: IconComponent;
  selected: boolean;
  onPress: () => void;
}

/**
 * Tarjeta seleccionable (selección única) con icono, texto
 * e indicador de estado. Sustituye al patrón Button dentro de una View.
 */
export function OptionCard({
  title,
  description,
  icon: Icon,
  selected,
  onPress,
}: OptionCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={description ? `${title}. ${description}` : title}
      style={({ pressed }) => [
        styles.card,
        {
          padding: theme.spacing.md,
          borderRadius: theme.radii.md,
          marginBottom: theme.spacing.sm,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          backgroundColor: selected ? theme.colors.surface : theme.colors.card,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {Icon ? (
        <View
          style={[
            styles.iconBubble,
            {
              borderRadius: theme.radii.sm,
              marginRight: theme.spacing.md,
              backgroundColor: selected
                ? theme.colors.primary
                : theme.colors.surface,
            },
          ]}
        >
          <Icon
            size={20}
            color={
              selected
                ? theme.colors.primaryForeground
                : theme.colors.textSecondary
            }
          />
        </View>
      ) : null}

      <View style={styles.texts}>
        <Label size="md" weight="semibold">
          {title}
        </Label>
        {description ? (
          <Label
            size="sm"
            color={theme.colors.textSecondary}
            style={{ marginTop: 2 }}
          >
            {description}
          </Label>
        ) : null}
      </View>

      <View
        style={[
          styles.indicator,
          {
            marginLeft: theme.spacing.md,
            borderColor: selected ? theme.colors.primary : theme.colors.border,
            backgroundColor: selected ? theme.colors.primary : "transparent",
          },
        ]}
      >
        {selected ? (
          <Check
            size={14}
            color={theme.colors.primaryForeground}
            strokeWidth={3}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
  },
  iconBubble: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    flex: 1,
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
