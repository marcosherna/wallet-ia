import React, { useEffect, useState } from "react";

import { Alert } from "react-native";
import { BottomSheet, Button, Input, Label } from "../../../components/ui";
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
  const { theme } = useTheme();
  const { budgets, saveBudget, removeBudget, month, money } = useFinance();
  const [categoryId, setCategoryId] = useState<CategoryId>("food");
  const [limit, setLimit] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!visible) return;
    const free = (Object.keys(CATEGORIES) as CategoryId[]).find(
      (c) => c !== "income" && !budgets.some((b) => b.categoryId === c),
    );
    setCategoryId(editing?.categoryId ?? free ?? "food");
    setLimit(editing ? String(editing.limit) : "");
    setError("");
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
      visible={visible}
      title={editing ? "Editar presupuesto" : "Nuevo presupuesto"}
      onClose={onClose}
    >
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
    </BottomSheet>
  );
}
