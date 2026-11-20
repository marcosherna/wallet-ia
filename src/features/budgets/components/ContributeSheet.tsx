import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@expo/ui/community/bottom-sheet";

import { Button, Chip, Input, Label } from "../../../components/ui";
import { useTheme } from "../../../core/hooks/useTheme";
import { useFinance } from "../../../core/hooks/useFinance";
import { Goal } from "../../../core/types/Finance";
import { sanitizeAmount } from "../../../core/utils/Format";

interface Props {
  goal: Goal | null;
  onClose: () => void;
}

export function ContributeSheet({ goal, onClose }: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { theme } = useTheme();
  const { contributeToGoal, money } = useFinance();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (goal) {
      bottomSheetRef.current?.expand();
      setAmount(String(goal.monthlyContribution));
      setError("");
    } else {
      bottomSheetRef.current?.close();
    }
  }, [goal]);

  const remaining = goal ? Math.max(goal.target - goal.saved, 0) : 0;
  const suggestions = [25, 50, 100].filter((v) => v < remaining);

  const submit = () => {
    if (!goal) return;
    const value = Number(amount);
    if (!(value > 0)) return setError("Ingresa un monto mayor a cero.");
    contributeToGoal(goal.id, value);
    onClose();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={goal ? 0 : -1}
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
        {goal ? (
          <>
            <Label size="lg" weight="semibold" style={styles.title}>
              Abonar a &ldquo;{goal.name}&rdquo;
            </Label>

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

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: theme.spacing.sm,
              }}
            >
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

            <Button
              title="Confirmar abono"
              size="lg"
              fullWidth
              onPress={submit}
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
