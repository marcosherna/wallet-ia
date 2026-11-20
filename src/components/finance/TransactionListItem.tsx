import React from "react";
import { Pressable, View } from "react-native";

import { useTheme } from "../../core/hooks/useTheme";

import { useStatusColors } from "../../core/theme/Status";
import { useFinance } from "../../core/hooks/useFinance";
import { CATEGORIES, TRANSFER_ICON } from "../../core/constants/Categories";
import { Transaction } from "../../core/types/Finance";
import { IconBadge, Label } from "../ui";

interface Props {
  tx: Transaction;
  onPress?: (tx: Transaction) => void;
}

export function TransactionListItem({ tx, onPress }: Props) {
  const { theme } = useTheme();
  const { success } = useStatusColors();
  const { accounts, money } = useFinance();

  const account = accounts.find((a) => a.id === tx.accountId)?.name ?? "—";
  const toAccount = accounts.find((a) => a.id === tx.toAccountId)?.name;
  const icon =
    tx.type === "transfer" ? TRANSFER_ICON : CATEGORIES[tx.categoryId].icon;
  const subtitle =
    tx.type === "transfer"
      ? `${account} → ${toAccount ?? "—"}`
      : `${CATEGORIES[tx.categoryId].label} · ${account}`;

  const amountColor =
    tx.type === "income"
      ? success
      : tx.type === "transfer"
        ? theme.colors.textSecondary
        : theme.colors.text;
  const sign = tx.type === "income" ? "+" : tx.type === "expense" ? "-" : "";

  return (
    <Pressable
      onPress={() => onPress?.(tx)}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.sm + 2,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <IconBadge
        icon={icon}
        tone={tx.type === "income" ? "success" : "neutral"}
      />
      <View style={{ flex: 1 }}>
        <Label size="md" weight="semibold" numberOfLines={1}>
          {tx.note || CATEGORIES[tx.categoryId].label}
        </Label>
        <Label size="xs" color={theme.colors.textSecondary} numberOfLines={1}>
          {subtitle}
          {tx.tags.length
            ? `  ·  ${tx.tags.map((t) => `#${t}`).join(" ")}`
            : ""}
        </Label>
      </View>
      <Label size="md" weight="bold" color={amountColor}>
        {sign}
        {money(tx.amount)}
      </Label>
    </Pressable>
  );
}
