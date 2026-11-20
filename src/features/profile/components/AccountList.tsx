import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Plus, Trash2 } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import {
  Button,
  Card,
  Divider,
  IconBadge,
  Label,
} from "../../../components/ui";
import { useStatusColors } from "../../../core/theme/Status";
import { useFinance } from "../../../core/hooks/useFinance";
import { ACCOUNT_TYPES } from "../../../core/constants/Categories";
import { Account } from "../../../core/types/Finance";

interface Props {
  onAdd: () => void;
  onDelete?: (account: Account) => void;
}

export function AccountList({ onAdd, onDelete }: Props) {
  const { theme } = useTheme();
  const { danger } = useStatusColors();
  const { accounts, money, deleteAccount } = useFinance();

  const handleConfirmDelete = (a: Account) => {
    if (onDelete) {
      onDelete(a);
      return;
    }
    Alert.alert(
      "Eliminar cuenta",
      `¿Estás seguro de que deseas eliminar la cuenta "${a.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteAccount(a.id),
        },
      ],
    );
  };

  return (
    <Card padded={false}>
      {accounts.map((a, i) => {
        const meta = ACCOUNT_TYPES[a.type] ?? ACCOUNT_TYPES.checking;
        const isCard = a.type === "credit_card";
        return (
          <View key={a.id}>
            {i > 0 && <Divider />}
            <TouchableOpacity
              activeOpacity={0.7}
              onLongPress={() => handleConfirmDelete(a)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.md,
                padding: theme.spacing.md,
              }}
            >
              <IconBadge
                icon={meta.icon}
                tone={isCard ? "danger" : "neutral"}
              />
              <View style={{ flex: 1 }}>
                <Label size="md" weight="semibold">
                  {a.name}
                </Label>
                <Label size="xs" color={theme.colors.textSecondary}>
                  {meta.label}
                  {a.institution ? ` · ${a.institution}` : ""}
                </Label>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Label
                  size="md"
                  weight="bold"
                  color={isCard ? danger : theme.colors.text}
                >
                  {isCard ? `-${money(a.balance)}` : money(a.balance)}
                </Label>
                {isCard && (
                  <Label size="xs" color={theme.colors.textSecondary}>
                    Deuda
                  </Label>
                )}
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
      <Divider />
      <View style={{ padding: theme.spacing.sm }}>
        <Button
          title="Agregar cuenta o tarjeta"
          variant="ghost"
          leftIcon={Plus}
          onPress={onAdd}
        />
      </View>
    </Card>
  );
}
