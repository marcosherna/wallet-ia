import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@expo/ui/community/bottom-sheet";
import { Trash2 } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Badge, Button, Divider, Label } from "../../../components/ui";
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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { theme } = useTheme();
  const { danger } = useStatusColors();
  const { accounts, money, updateTransaction, deleteTransaction } =
    useFinance();
  const [categoryId, setCategoryId] = useState<CategoryId>("other");

  useEffect(() => {
    if (tx) {
      setCategoryId(tx.categoryId);
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [tx]);

  const account = tx
    ? (accounts.find((a) => a.id === tx.accountId)?.name ?? "—")
    : "—";
  const toAccount = tx
    ? accounts.find((a) => a.id === tx.toAccountId)?.name
    : undefined;
  const typeLabel = !tx
    ? ""
    : tx.type === "income"
      ? "Ingreso"
      : tx.type === "expense"
        ? "Gasto"
        : "Transferencia";

  const confirmDelete = () => {
    if (!tx) return;
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
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={tx ? 0 : -1}
      enablePanDownToClose
      onClose={onClose}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
            gap: theme.spacing.md,
          },
        ]}
      >
        {tx ? (
          <>
            <Label size="lg" weight="semibold" style={styles.title}>
              Detalle del movimiento
            </Label>

            <View style={{ alignItems: "center", gap: theme.spacing.sm }}>
              <Badge
                label={typeLabel}
                tone={tx.type === "income" ? "success" : "neutral"}
              />
              <Label
                size="xl"
                weight="bold"
                style={{ fontSize: 32, lineHeight: 38 }}
              >
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
          </>
        ) : null}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
  },
  title: {
    textAlign: "center",
  },
});
