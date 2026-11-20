import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { BottomSheet, Button, Chip, Input } from "../../../components/ui";
import { useFinance } from "../../../core/hooks/useFinance";
import { AccountType } from "../../../core/types/Finance";
import { FieldLabel } from "../../../components/FieldLabel";
import { ACCOUNT_TYPES } from "../../../core/constants/Categories";
import { sanitizeAmount } from "../../../core/utils/Format";
export function AccountFormSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const { addAccount } = useFinance();
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("checking");
  const [balance, setBalance] = useState("");
  const [institution, setInstitution] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setName("");
      setType("checking");
      setBalance("");
      setInstitution("");
      setError("");
    }
  }, [visible]);

  const submit = () => {
    if (!name.trim()) return setError("Escribe un nombre para la cuenta.");
    addAccount({
      name: name.trim(),
      type,
      balance: Number(balance) || 0,
      institution: institution.trim() || undefined,
    });
    onClose();
  };

  return (
    <BottomSheet visible={visible} title="Nueva cuenta" onClose={onClose}>
      <View>
        <FieldLabel>Tipo</FieldLabel>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.sm,
          }}
        >
          {(Object.keys(ACCOUNT_TYPES) as AccountType[]).map((t) => (
            <Chip
              key={t}
              label={ACCOUNT_TYPES[t].label}
              selected={type === t}
              onPress={() => setType(t)}
            />
          ))}
        </View>
      </View>
      <Input
        label="Nombre"
        placeholder="Ej. Cuenta de nómina"
        value={name}
        onChangeText={(t) => {
          setName(t);
          setError("");
        }}
        error={error}
        containerStyle={{ marginVertical: 0 }}
      />
      <Input
        label={type === "credit_card" ? "Deuda actual" : "Saldo actual"}
        prefix="$"
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={balance}
        onChangeText={(t) => setBalance(sanitizeAmount(t))}
        containerStyle={{ marginVertical: 0 }}
      />
      <Input
        label="Institución (opcional)"
        placeholder="Ej. Banco principal"
        value={institution}
        onChangeText={setInstitution}
        containerStyle={{ marginVertical: 0 }}
      />
      <Button title="Guardar cuenta" size="lg" fullWidth onPress={submit} />
    </BottomSheet>
  );
}
