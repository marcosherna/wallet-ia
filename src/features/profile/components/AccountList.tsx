import React from "react";
import { View } from "react-native";
import { Plus } from "lucide-react-native";

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

export function AccountList({ onAdd }: { onAdd: () => void }) {
  const { theme } = useTheme();
  const { danger } = useStatusColors();
  const { accounts, money } = useFinance();

  return (
    <Card padded={false}>
      {accounts.map((a, i) => {
        const meta = ACCOUNT_TYPES[a.type];
        const isCard = a.type === "credit_card";
        return (
          <View key={a.id}>
            {i > 0 && <Divider />}
            <View
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
            </View>
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
