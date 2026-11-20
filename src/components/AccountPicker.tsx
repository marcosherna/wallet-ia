import React from "react";
import { View } from "react-native";

import { Chip } from "./ui";
import { useTheme } from "../core/hooks/useTheme";
import { useFinance } from "../core/hooks/useFinance";
import { FieldLabel } from "./FieldLabel";

interface Props {
  value: string;
  onChange: (id: string) => void;
  label: string;
  excludeId?: string;
}

export function AccountPicker({ value, onChange, label, excludeId }: Props) {
  const { theme } = useTheme();
  const { accounts } = useFinance();
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
        {accounts
          .filter((a) => a.id !== excludeId)
          .map((a) => (
            <Chip
              key={a.id}
              label={a.name}
              selected={value === a.id}
              onPress={() => onChange(a.id)}
            />
          ))}
      </View>
    </View>
  );
}
