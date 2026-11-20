import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@expo/ui/community/bottom-sheet";

import { Button, Input, Label } from "../../../components/ui";
import { CategoryPicker } from "../../../components/finance";
import { useTheme } from "../../../core/hooks/useTheme";
import { CategoryBudget, CategoryId } from "../../../core/types/Finance";
import { CATEGORIES } from "../../../core/constants/Categories";
import { useFinance } from "../../../core/hooks/useFinance";
import { sanitizeAmount } from "../../../core/utils/Format";

interface Props {
  visible: boolean;
  /** Si se pasa, se edita ese presupuesto. */
  editing: CategoryBudget | null;
  onClose: () => void;
}

export function BudgetFormSheet({ visible, editing, onClose }: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { theme } = useTheme();
  const { budgets, saveBudget, removeBudget, month, money } = useFinance();
  const [categoryId, setCategoryId] = useState<CategoryId>("food");
  const [limit, setLimit] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
      const free = (Object.keys(CATEGORIES) as CategoryId[]).find(
        (c) => c !== "income" && !budgets.some((b) => b.categoryId === c),
      );
      setCategoryId(editing?.categoryId ?? free ?? "food");
      setLimit(editing ? String(editing.limit) : "");
      setError("");
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible, editing]); // eslint-disable-line react-hooks/exhaustive-deps

  const spent = month.byCategory[categoryId] ?? 0;

  const submit = () => {
    const value = Number(limit);
    if (!(value > 0)) return setError("Define un tope mayor a cero.");
    saveBudget(categoryId, value);
    onClose();
  };

  const confirmRemove = () =>
    Alert.alert(
      "Quitar presupuesto",
      "Dejarás de ver el límite de esta categoría.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Quitar",
          style: "destructive",
          onPress: () => {
            if (editing) removeBudget(editing.id);
            onClose();
          },
        },
      ],
    );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
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
        <Label size="lg" weight="semibold" style={styles.title}>
          {editing ? "Editar presupuesto" : "Nuevo presupuesto"}
        </Label>

        {!editing && (
          <CategoryPicker value={categoryId} onChange={setCategoryId} />
        )}

        <Input
          label={`Tope mensual para ${CATEGORIES[categoryId].label}`}
          prefix="$"
          keyboardType="decimal-pad"
          placeholder="Ej. 200"
          value={limit}
          onChangeText={(t) => {
            setLimit(sanitizeAmount(t));
            setError("");
          }}
          error={error}
          helperText={`Este mes llevas ${money(spent)} en esta categoría.`}
          containerStyle={{ marginVertical: 0 }}
        />

        <Label size="xs" color={theme.colors.textSecondary} paragraph>
          La barra cambia de verde a amarillo al 70% y a rojo al 90% del tope.
        </Label>

        <Button
          title="Guardar presupuesto"
          size="lg"
          fullWidth
          onPress={submit}
        />

        {editing && (
          <Button
            title="Quitar presupuesto"
            variant="ghost"
            onPress={confirmRemove}
          />
        )}
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
