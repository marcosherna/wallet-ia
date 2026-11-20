import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@expo/ui/community/bottom-sheet";

import { useTheme } from "../../../core/hooks/useTheme";
import { Button, Chip, Input, Label } from "../../../components/ui";
import { useFinance } from "../../../core/hooks/useFinance";
import { LoanKind } from "../../../core/types/Finance";
import { calcInstallment } from "../../../core/utils/Finance";
import { FieldLabel } from "../../../components/FieldLabel";
import { LOAN_KINDS } from "../../../core/constants/Categories";
import { sanitizeAmount } from "../../../core/utils/Format";

export function LoanFormSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { theme } = useTheme();
  const { addLoan, money } = useFinance();

  const [name, setName] = useState("");
  const [kind, setKind] = useState<LoanKind>("auto");
  const [principal, setPrincipal] = useState("");
  const [apr, setApr] = useState("");
  const [term, setTerm] = useState("");
  const [payment, setPayment] = useState("");
  const [day, setDay] = useState("");
  const [paid, setPaid] = useState("0");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
      setName("");
      setKind("auto");
      setPrincipal("");
      setApr("");
      setTerm("");
      setPayment("");
      setDay("");
      setPaid("0");
      setError("");
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const estimate = calcInstallment(
    Number(principal),
    Number(apr) || 0,
    Number(term),
  );

  const submit = () => {
    const p = Number(principal),
      t = Number(term),
      m = Number(payment) || estimate,
      d = Number(day),
      n = Number(paid) || 0;
    if (!name.trim()) return setError("Escribe un nombre para el crédito.");
    if (!(p > 0) || !(t > 0))
      return setError("Indica el monto total y el plazo en meses.");
    if (!(m > 0)) return setError("Indica la cuota mensual.");
    if (!(d >= 1 && d <= 31))
      return setError("El día de pago debe estar entre 1 y 31.");
    if (n > t)
      return setError("Las cuotas pagadas no pueden superar el plazo.");
    addLoan({
      name: name.trim(),
      kind,
      principal: p,
      apr: Number(apr) || 0,
      termMonths: t,
      monthlyPayment: Number(m.toFixed(2)),
      paymentDay: d,
      paidInstallments: n,
    });
    onClose();
  };

  const clear = () => setError("");
  const field = { marginVertical: 0 } as const;

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
          Registrar crédito
        </Label>

        <View>
          <FieldLabel>Tipo de crédito</FieldLabel>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: theme.spacing.sm,
            }}
          >
            {(Object.keys(LOAN_KINDS) as LoanKind[]).map((k) => (
              <Chip
                key={k}
                label={LOAN_KINDS[k].label}
                selected={kind === k}
                onPress={() => setKind(k)}
              />
            ))}
          </View>
        </View>

        <Input
          label="Nombre"
          placeholder="Ej. Crédito del auto"
          value={name}
          onChangeText={(t) => {
            setName(t);
            clear();
          }}
          containerStyle={field}
        />

        <Input
          label="Monto total"
          prefix="$"
          keyboardType="decimal-pad"
          value={principal}
          onChangeText={(t) => {
            setPrincipal(sanitizeAmount(t));
            clear();
          }}
          containerStyle={field}
        />

        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
          <Input
            label="Tasa anual (APR)"
            suffix="%"
            keyboardType="decimal-pad"
            value={apr}
            onChangeText={(t) => setApr(sanitizeAmount(t))}
            containerStyle={{ flex: 1, marginVertical: 0 }}
          />
          <Input
            label="Plazo"
            suffix="meses"
            keyboardType="number-pad"
            maxLength={3}
            value={term}
            onChangeText={(t) => {
              setTerm(t.replace(/\D/g, ""));
              clear();
            }}
            containerStyle={{ flex: 1, marginVertical: 0 }}
          />
        </View>

        <Input
          label="Cuota fija mensual"
          prefix="$"
          keyboardType="decimal-pad"
          value={payment}
          onChangeText={(t) => {
            setPayment(sanitizeAmount(t));
            clear();
          }}
          helperText={
            estimate > 0
              ? `Cuota estimada con estos datos: ${money(estimate)}`
              : "Déjala vacía para usar la cuota estimada."
          }
          containerStyle={field}
        />

        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
          <Input
            label="Día de pago"
            keyboardType="number-pad"
            maxLength={2}
            placeholder="1-31"
            value={day}
            onChangeText={(t) => {
              setDay(t.replace(/\D/g, ""));
              clear();
            }}
            containerStyle={{ flex: 1, marginVertical: 0 }}
          />
          <Input
            label="Cuotas ya pagadas"
            keyboardType="number-pad"
            maxLength={3}
            value={paid}
            onChangeText={(t) => setPaid(t.replace(/\D/g, ""))}
            containerStyle={{ flex: 1, marginVertical: 0 }}
          />
        </View>

        {error ? (
          <Label size="sm" weight="medium" color={theme.colors.error}>
            {error}
          </Label>
        ) : null}

        <Button title="Guardar crédito" size="lg" fullWidth onPress={submit} />
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
