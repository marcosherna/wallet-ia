import React from "react";
import { View } from "react-native";

import { FieldLabel } from "./FieldLabel";
import { useTheme } from "../core/hooks/useTheme";
import { CategoryId } from "../core/types/Finance";
import { CATEGORIES, EXPENSE_CATEGORIES } from "../core/constants/Categories";
import { Chip } from "./ui";

interface Props {
  value: CategoryId;
  onChange: (id: CategoryId) => void;
  label?: string;
  options?: CategoryId[];
}

export function CategoryPicker({
  value,
  onChange,
  label = "Categoría",
  options = EXPENSE_CATEGORIES,
}: Props) {
  const { theme } = useTheme();
  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: theme.spacing.sm,
        }}
      >
        {options.map((id) => (
          <Chip
            key={id}
            label={CATEGORIES[id].label}
            selected={value === id}
            onPress={() => onChange(id)}
          />
        ))}
      </View>
    </View>
  );
}
