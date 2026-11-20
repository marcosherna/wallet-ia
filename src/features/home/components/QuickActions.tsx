import React from "react";
import { Pressable, View } from "react-native";
import { ArrowLeftRight, Minus, Plus } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { IconBadge, Label } from "../../../components/ui";
import { TxType } from "../../../core/types/Finance";
import { IconComponent, Tone } from "../../../components/ui/types";

interface Props {
  onSelect: (type: TxType) => void;
}

const ACTIONS: {
  type: TxType;
  label: string;
  icon: IconComponent;
  tone: Tone;
}[] = [
  { type: "income", label: "Ingreso", icon: Plus, tone: "success" },
  { type: "expense", label: "Gasto", icon: Minus, tone: "danger" },
  {
    type: "transfer",
    label: "Transferir",
    icon: ArrowLeftRight,
    tone: "primary",
  },
];

export function QuickActions({ onSelect }: Props) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
      {ACTIONS.map((a) => (
        <Pressable
          key={a.type}
          onPress={() => onSelect(a.type)}
          accessibilityRole="button"
          accessibilityLabel={`Registrar ${a.label.toLowerCase()}`}
          style={({ pressed }) => ({
            flex: 1,
            alignItems: "center",
            gap: theme.spacing.sm,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radii.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.card,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <IconBadge icon={a.icon} tone={a.tone} />
          <Label size="sm" weight="semibold">
            {a.label}
          </Label>
        </Pressable>
      ))}
    </View>
  );
}
