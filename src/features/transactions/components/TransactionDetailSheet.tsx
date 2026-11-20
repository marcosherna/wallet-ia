import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Trash2 } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import {
  Badge,
  BottomSheet,
  Button,
  Divider,
  Label,
} from "../../../components/ui";
import { CategoryPicker } from "../../../components/finance";
import { CategoryId, Transaction } from "../../../core/types/Finance";
import { useStatusColors } from "../../../core/theme/Status";
import { useFinance } from "../../../core/hooks/useFinance";
import { CATEGORIES } from "../../../core/constants/Categories";
import { formatLongDate } from "../../../core/utils/Format";

interface Props {
  tx: Transaction | null;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: theme.spacing.md,
      }}
    >
      <Label size="sm" color={theme.colors.textSecondary}>
        {label}
      </Label>
      <Label
        size="sm"
        weight="medium"
        style={{ flexShrink: 1, textAlign: "right" }}
      >
        {value}
      </Label>
    </View>
  );
}

export function TransactionDetailSheet({ tx, onClose }: Props) {
  const { theme } = useTheme();
  const { danger } = useStatusColors();
  const { accounts, money, updateTransaction, deleteTransaction } =
    useFinance();
  const [categoryId, setCategoryId] = useState<CategoryId>("other");

  useEffect(() => {
    if (tx) setCategoryId(tx.categoryId);
  }, [tx]);

  if (!tx)
    return (
      <BottomSheet visible={false} title="" onClose={onClose}>
        {null}
      </BottomSheet>
    );

  const account = accounts.find((a) => a.id === tx.accountId)?.name ?? "—";
  const toAccount = accounts.find((a) => a.id === tx.toAccountId)?.name;
  const typeLabel =
    tx.type === "income"
      ? "Ingreso"
      : tx.type === "expense"
        ? "Gasto"
        : "Transferencia";

  const confirmDelete = () =>
    Alert.alert(
      "Eliminar movimiento",
      "Se revertirá su efecto en el saldo de la cuenta. ¿Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteTransaction(tx.id);
            onClose();
          },
        },
      ],
    );

  return (
    <BottomSheet visible title="Detalle del movimiento" onClose={onClose}>
      <View style={{ alignItems: "center", gap: theme.spacing.sm }}>
        <Badge
          label={typeLabel}
          tone={tx.type === "income" ? "success" : "neutral"}
        />
        <Label size="xl" weight="bold" style={{ fontSize: 32, lineHeight: 38 }}>
          {money(tx.amount)}
        </Label>
        <Label size="md" color={theme.colors.textSecondary}>
          {tx.note || CATEGORIES[tx.categoryId].label}
        </Label>
      </View>

      <Divider />
      <Row label="Fecha" value={formatLongDate(tx.date)} />
      <Row
        label={tx.type === "transfer" ? "Desde" : "Cuenta"}
        value={account}
      />
      {toAccount ? <Row label="Hacia" value={toAccount} /> : null}
      {tx.type !== "transfer" ? (
        <Row label="Categoría" value={CATEGORIES[tx.categoryId].label} />
      ) : null}
      <Row
        label="Etiquetas"
        value={
          tx.tags.length
            ? tx.tags.map((t) => `#${t}`).join(" ")
            : "Sin etiquetas"
        }
      />
      <Divider />

      {tx.type === "expense" && (
        <>
          <CategoryPicker
            label="Cambiar categoría"
            value={categoryId}
            onChange={setCategoryId}
          />
          <Button
            title="Guardar categoría"
            variant="outline"
            disabled={categoryId === tx.categoryId}
            onPress={() => {
              updateTransaction(tx.id, { categoryId });
              onClose();
            }}
          />
        </>
      )}

      <Button
        title="Eliminar movimiento"
        variant="ghost"
        leftIcon={Trash2}
        textStyle={{ color: danger }}
        onPress={confirmDelete}
      />
    </BottomSheet>
  );
}
