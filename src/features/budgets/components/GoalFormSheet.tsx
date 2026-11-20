import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import {
  addMonthsISO,
  evaluateGoal,
  monthsUntil,
} from "../../../core/utils/Finance";
import type { GoalIconId } from "../../../core/types/Finance";
import {
  BottomSheet,
  Button,
  Chip,
  Input,
  Label,
  SegmentedControl,
} from "../../../components/ui";
import { FeasibilityCard } from "./FeasibilityCard";
import { FieldLabel } from "../../../components/FieldLabel";
import { useStatusColors } from "../../../core/theme/Status";
import { useFinance } from "../../../core/hooks/useFinance";
import { parseDateInput, sanitizeAmount } from "../../../core/utils/Format";
import { GOAL_ICONS } from "../../../core/constants/Categories";

interface Props {
  visible: boolean;
  onClose: () => void;
}

type Mode = "months" | "date";

export function GoalFormSheet({ visible, onClose }: Props) {
  const { theme } = useTheme();
  const { danger } = useStatusColors();
  const { addGoal, freeToSpend, month } = useFinance();

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [mode, setMode] = useState<Mode>("months");
  const [months, setMonths] = useState("12");
  const [date, setDate] = useState("");
  const [icon, setIcon] = useState<GoalIconId>("target");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setName("");
      setTarget("");
      setMonths("12");
      setDate("");
      setIcon("target");
      setMode("months");
      setError("");
    }
  }, [visible]);

  const resolvedMonths = useMemo(() => {
    if (mode === "months") return Math.floor(Number(months)) || 0;
    const d = parseDateInput(date);
    return d ? monthsUntil(d.toISOString()) : 0;
  }, [mode, months, date]);

  const targetValue = Number(target);
  const evaluation =
    targetValue > 0 && resolvedMonths > 0
      ? evaluateGoal({
          target: targetValue,
          months: resolvedMonths,
          freeCash: freeToSpend,
          leisureSpend: month.byCategory.leisure ?? 0,
        })
      : null;

  const submit = () => {
    if (!name.trim()) return setError("Dale un nombre a tu meta.");
    if (!(targetValue > 0)) return setError("Ingresa el monto objetivo.");
    if (resolvedMonths < 1) return setError("Indica un plazo válido.");
    addGoal({
      name: name.trim(),
      target: targetValue,
      deadline: addMonthsISO(resolvedMonths),
      icon,
      monthlyContribution:
        Math.ceil((targetValue / resolvedMonths) * 100) / 100,
    });
    onClose();
  };

  return (
    <BottomSheet visible={visible} title="Nueva meta" onClose={onClose}>
      <Input
        label="¿Qué quieres lograr?"
        placeholder="Ej. Comprar un auto"
        value={name}
        onChangeText={(t) => {
          setName(t);
          setError("");
        }}
        containerStyle={{ marginVertical: 0 }}
      />

      <View>
        <FieldLabel>Tipo de meta</FieldLabel>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.sm,
          }}
        >
          {(Object.keys(GOAL_ICONS) as GoalIconId[]).map((id) => (
            <Chip
              key={id}
              label={GOAL_ICONS[id].label}
              selected={icon === id}
              onPress={() => setIcon(id)}
            />
          ))}
        </View>
      </View>

      <Input
        label="Monto objetivo"
        prefix="$"
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={target}
        onChangeText={(t) => {
          setTarget(sanitizeAmount(t));
          setError("");
        }}
        containerStyle={{ marginVertical: 0 }}
      />

      <SegmentedControl
        options={[
          { id: "months" as Mode, label: "Plazo en meses" },
          { id: "date" as Mode, label: "Fecha límite" },
        ]}
        value={mode}
        onChange={setMode}
      />
      {mode === "months" ? (
        <Input
          label="Meses para lograrlo"
          keyboardType="number-pad"
          maxLength={3}
          value={months}
          onChangeText={(t) => {
            setMonths(t.replace(/\D/g, ""));
            setError("");
          }}
          containerStyle={{ marginVertical: 0 }}
        />
      ) : (
        <Input
          label="Fecha límite"
          placeholder="AAAA-MM-DD"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          value={date}
          onChangeText={(t) => {
            setDate(t);
            setError("");
          }}
          helperText={
            resolvedMonths ? `Equivale a ${resolvedMonths} meses` : undefined
          }
          containerStyle={{ marginVertical: 0 }}
        />
      )}

      {evaluation ? <FeasibilityCard result={evaluation} /> : null}
      {error ? (
        <Label size="sm" weight="medium" color={danger}>
          {error}
        </Label>
      ) : null}
      <Button title="Crear meta" size="lg" fullWidth onPress={submit} />
    </BottomSheet>
  );
}
