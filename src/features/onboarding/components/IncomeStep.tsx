import React from "react";
import { View } from "react-native";

import { INCOME_SUGGESTIONS } from "../onboarding.data";
import { StepHeader } from "./StepHeader";
import { useTheme } from "../../../core/hooks/useTheme";
import { Input } from "../../../components/ui";
import { Chip } from "../../../components/ui/Chip";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

/** Deja solo dígitos y un punto decimal con máximo 2 decimales. */
const sanitizeAmount = (text: string) => {
  const cleaned = text.replace(/[^0-9.]/g, "");
  const [integer, ...rest] = cleaned.split(".");
  return rest.length ? `${integer}.${rest.join("").slice(0, 2)}` : integer;
};

const formatNumber = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function IncomeStep({ value, onChange }: Props) {
  const { theme } = useTheme();
  const amount = Number(value);
  const annual =
    amount > 0 ? `≈ $${formatNumber(amount * 12)} al año` : undefined;

  return (
    <View>
      <StepHeader
        title="¿Cuáles son tus ingresos mensuales netos?"
        subtitle="Es lo que recibes después de impuestos y descuentos. Un promedio aproximado basta."
      />

      <Input
        label="Ingreso mensual"
        placeholder="0.00"
        prefix="$"
        suffix="USD"
        keyboardType="decimal-pad"
        maxLength={10}
        value={value}
        onChangeText={(text) => onChange(sanitizeAmount(text))}
        helperText={annual ?? "Puedes cambiarlo después en tu perfil."}
        containerStyle={{ marginVertical: 0 }}
      />

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: theme.spacing.sm,
          marginTop: theme.spacing.md,
        }}
      >
        {INCOME_SUGGESTIONS.map((suggestion) => (
          <Chip
            key={suggestion}
            label={`$${formatNumber(suggestion)}`}
            selected={value === String(suggestion)}
            onPress={() => onChange(String(suggestion))}
          />
        ))}
      </View>
    </View>
  );
}
