import React, { useEffect, useState } from "react";

import {
  BottomSheet,
  Button,
  Chip,
  Input,
  Label,
} from "../../../components/ui";
import { View } from "react-native";
import { useTheme } from "../../../core/hooks/useTheme";
import { useFinance } from "../../../core/hooks/useFinance";
import { Goal } from "../../../core/types/Finance";
import { sanitizeAmount } from "../../../core/utils/Format";

interface Props {
  goal: Goal | null;
  onClose: () => void;
}

export function ContributeSheet({ goal, onClose }: Props) {
  const { theme } = useTheme();
  const { contributeToGoal, money } = useFinance();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAmount(goal ? String(goal.monthlyContribution) : "");
    setError("");
  }, [goal]);

  if (!goal)
    return (
      <BottomSheet visible={false} title="" onClose={onClose}>
        {null}
      </BottomSheet>
    );

  const remaining = Math.max(goal.target - goal.saved, 0);
  const suggestions = [25, 50, 100].filter((v) => v < remaining);

  const submit = () => {
    const value = Number(amount);
    if (!(value > 0)) return setError("Ingresa un monto mayor a cero.");
    contributeToGoal(goal.id, value);
    onClose();
  };

  return (
    <BottomSheet visible title={`Abonar a "${goal.name}"`} onClose={onClose}>
      <Label size="sm" color={theme.colors.textSecondary}>
        Te faltan {money(remaining)} para completar esta meta.
      </Label>
      <Input
        label="Monto del abono"
        prefix="$"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={(t) => {
          setAmount(sanitizeAmount(t));
          setError("");
        }}
        error={error}
        containerStyle={{ marginVertical: 0 }}
      />
      <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
        {suggestions.map((v) => (
          <Chip
            key={v}
            label={`$${v}`}
            selected={amount === String(v)}
            onPress={() => setAmount(String(v))}
          />
        ))}
        <Chip
          label="Cuota programada"
          selected={amount === String(goal.monthlyContribution)}
          onPress={() => setAmount(String(goal.monthlyContribution))}
        />
      </View>
      <Button title="Confirmar abono" size="lg" fullWidth onPress={submit} />
    </BottomSheet>
  );
}
