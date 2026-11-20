import React, { useEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@expo/ui/community/bottom-sheet";
import { StyleSheet, Text, View } from "react-native";
import { CategoryId, TxType } from "../../core/types/Finance";
import { useFinance } from "../../core/hooks/useFinance";
import { Button, Input, SegmentedControl } from "../ui";
import { sanitizeAmount } from "../../core/utils/Format";
import { CategoryPicker } from "../CategoryPicker";
import { AccountPicker } from "../AccountPicker";

interface Props {
  visible: boolean;
  initialType?: TxType;
  onClose: () => void;
}

const TYPE_OPTIONS = [
  { id: "expense" as TxType, label: "Gasto" },
  { id: "income" as TxType, label: "Ingreso" },
  { id: "transfer" as TxType, label: "Transferencia" },
];

export function TransactionFormSheet({
  visible,
  initialType = "expense",
  onClose,
}: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { accounts, addTransaction } = useFinance();

  const [type, setType] = useState<TxType>(initialType);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<CategoryId>("food");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id ?? "");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  // Controlar la visibilidad de la hoja mediante la ref
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
      setType(initialType);
      setAmount("");
      setNote("");
      setTags("");
      setError("");
      setCategoryId("food");
      setAccountId(accounts[0]?.id ?? "");
      setToAccountId(accounts[1]?.id ?? "");
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible, initialType, accounts]);

  const submit = () => {
    const value = Number(amount);
    if (!(value > 0)) return setError("Ingresa un monto mayor a cero.");
    if (type === "transfer" && (!toAccountId || toAccountId === accountId))
      return setError("Elige una cuenta de destino distinta al origen.");

    addTransaction({
      type,
      amount: value,
      categoryId:
        type === "income"
          ? "income"
          : type === "transfer"
            ? "other"
            : categoryId,
      accountId,
      toAccountId: type === "transfer" ? toAccountId : undefined,
      note: note.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean),
      date: new Date().toISOString(),
    });
    onClose();
  };

  const title =
    type === "income"
      ? "Nuevo ingreso"
      : type === "transfer"
        ? "Nueva transferencia"
        : "Nuevo gasto";

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      enablePanDownToClose
      onClose={onClose}
    >
      <BottomSheetView style={styles.contentContainer}>
        {title && <Text style={styles.title}>{title}</Text>}

        <SegmentedControl
          options={TYPE_OPTIONS}
          value={type}
          onChange={setType}
        />

        <Input
          label="Monto"
          prefix="$"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={(t) => {
            setAmount(sanitizeAmount(t));
            setError("");
          }}
          error={error}
          containerStyle={{ marginVertical: 0 }}
        />

        {type === "expense" && (
          <CategoryPicker value={categoryId} onChange={setCategoryId} />
        )}

        <AccountPicker
          label={type === "income" ? "Cuenta de destino" : "Cuenta de origen"}
          value={accountId}
          onChange={(id) => {
            setAccountId(id);
            if (id === toAccountId)
              setToAccountId(accounts.find((a) => a.id !== id)?.id ?? "");
          }}
        />

        {type === "transfer" && (
          <AccountPicker
            label="Cuenta de destino"
            value={toAccountId}
            onChange={setToAccountId}
            excludeId={accountId}
          />
        )}

        <Input
          label="Nota (opcional)"
          placeholder="Ej. Supermercado"
          value={note}
          onChangeText={setNote}
          containerStyle={{ marginVertical: 0 }}
        />

        <Input
          label="Etiquetas (opcional)"
          placeholder="Separadas por coma: viaje, trabajo"
          autoCapitalize="none"
          value={tags}
          onChangeText={setTags}
          containerStyle={{ marginVertical: 0 }}
        />

        <Button title="Guardar" size="lg" fullWidth onPress={submit} />
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
});
