import React from "react";
import { ScrollView, View } from "react-native";
import { Search } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";

import { Chip, Input, SegmentedControl } from "../../../components/ui";
import type { Filters, RangeFilter, TypeFilter } from "../filters";
import {
  CATEGORIES,
  EXPENSE_CATEGORIES,
} from "../../../core/constants/Categories";

interface Props {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
}

const TYPES: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "income", label: "Ingresos" },
  { id: "expense", label: "Egresos" },
  { id: "credit", label: "Créditos" },
];

const RANGES: { id: RangeFilter; label: string }[] = [
  { id: "month", label: "Este mes" },
  { id: "prev", label: "Mes anterior" },
  { id: "custom", label: "Personalizado" },
];

export function TransactionFilters({ filters, onChange }: Props) {
  const { theme } = useTheme();
  const bleed = { marginHorizontal: -theme.spacing.lg };
  const pad = { paddingHorizontal: theme.spacing.lg, gap: theme.spacing.sm };

  return (
    <View style={{ gap: theme.spacing.md }}>
      <Input
        placeholder="Buscar por nota, etiqueta o categoría"
        leftIcon={Search}
        value={filters.query}
        onChangeText={(query) => onChange({ query })}
        returnKeyType="search"
        autoCorrect={false}
        containerStyle={{ marginVertical: 0 }}
      />

      <SegmentedControl
        options={TYPES}
        value={filters.type}
        onChange={(type) => onChange({ type })}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={bleed}
        contentContainerStyle={pad}
      >
        <Chip
          label="Todas"
          selected={filters.category === null}
          onPress={() => onChange({ category: null })}
        />
        {EXPENSE_CATEGORIES.map((id) => (
          <Chip
            key={id}
            label={CATEGORIES[id].label}
            selected={filters.category === id}
            onPress={() =>
              onChange({ category: filters.category === id ? null : id })
            }
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={bleed}
        contentContainerStyle={pad}
      >
        {RANGES.map((r) => (
          <Chip
            key={r.id}
            label={r.label}
            selected={filters.range === r.id}
            onPress={() => onChange({ range: r.id })}
          />
        ))}
      </ScrollView>

      {filters.range === "custom" && (
        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
          <Input
            label="Desde"
            placeholder="AAAA-MM-DD"
            value={filters.from}
            onChangeText={(from) => onChange({ from })}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            containerStyle={{ flex: 1, marginVertical: 0 }}
          />
          <Input
            label="Hasta"
            placeholder="AAAA-MM-DD"
            value={filters.to}
            onChangeText={(to) => onChange({ to })}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            containerStyle={{ flex: 1, marginVertical: 0 }}
          />
        </View>
      )}
    </View>
  );
}
