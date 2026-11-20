import React, { useMemo, useState } from "react";
import { SectionList, View } from "react-native";
import { Plus, ReceiptText } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import {
  Button,
  Card,
  EmptyState,
  Label,
  ScreenContainer,
} from "../../../components/ui";
import {
  TransactionFormSheet,
  TransactionListItem,
} from "../../../components/finance";

import {
  TransactionDetailSheet,
  TransactionFilters,
  TransactionSummary,
} from "../components";

import { applyFilters, DEFAULT_FILTERS, Filters } from "../filters";
import { useFinance } from "../../../core/hooks/useFinance";
import { Transaction } from "../../../core/types/Finance";
import { formatDayGroup } from "../../../core/utils/Format";

const dayKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export default function TransactionsScreen() {
  const { theme } = useTheme();
  const { transactions, accounts, money } = useFinance();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const items = useMemo(
    () => applyFilters(transactions, filters, accounts),
    [transactions, filters, accounts],
  );

  const sections = useMemo(() => {
    const map = new Map<
      string,
      { title: string; net: number; data: Transaction[] }
    >();
    items.forEach((t) => {
      const key = dayKey(t.date);
      if (!map.has(key))
        map.set(key, { title: formatDayGroup(t.date), net: 0, data: [] });
      const s = map.get(key)!;
      s.data.push(t);
      if (t.type === "income") s.net += t.amount;
      if (t.type === "expense") s.net -= t.amount;
    });
    return Array.from(map.values());
  }, [items]);

  const patchFilters = (patch: Partial<Filters>) =>
    setFilters((f) => ({ ...f, ...patch }));
  const hasFilters =
    JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <ScreenContainer
      title="Movimientos"
      subtitle="Cada ingreso y gasto, en un solo lugar"
      scroll={false}
      headerRight={
        <Button
          title="Nuevo"
          size="sm"
          leftIcon={Plus}
          onPress={() => setFormOpen(true)}
        />
      }
    >
      <SectionList
        sections={sections}
        keyExtractor={(t) => t.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
        }}
        ListHeaderComponent={
          <View
            style={{ gap: theme.spacing.md, marginBottom: theme.spacing.sm }}
          >
            <TransactionFilters filters={filters} onChange={patchFilters} />
            <TransactionSummary items={items} />
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: theme.spacing.md,
              paddingBottom: theme.spacing.xs,
            }}
          >
            <Label
              size="sm"
              weight="semibold"
              color={theme.colors.textSecondary}
            >
              {section.title}
            </Label>
            <Label size="xs" color={theme.colors.textSecondary}>
              {money(section.net, { sign: true })}
            </Label>
          </View>
        )}
        renderItem={({ item, index, section }) => (
          <Card
            padded={false}
            style={{
              paddingHorizontal: theme.spacing.md,
              borderTopLeftRadius: index === 0 ? theme.radii.md : 0,
              borderTopRightRadius: index === 0 ? theme.radii.md : 0,
              borderBottomLeftRadius:
                index === section.data.length - 1 ? theme.radii.md : 0,
              borderBottomRightRadius:
                index === section.data.length - 1 ? theme.radii.md : 0,
              borderTopWidth: index === 0 ? 1 : 0,
            }}
          >
            <TransactionListItem tx={item} onPress={setSelected} />
          </Card>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={ReceiptText}
            title="Sin movimientos"
            description={
              hasFilters
                ? "No hay resultados con estos filtros."
                : "Registra tu primer ingreso o gasto."
            }
            actionLabel={hasFilters ? "Limpiar filtros" : "Agregar movimiento"}
            onAction={() =>
              hasFilters ? setFilters(DEFAULT_FILTERS) : setFormOpen(true)
            }
          />
        }
      />

      <TransactionDetailSheet tx={selected} onClose={() => setSelected(null)} />
      <TransactionFormSheet
        visible={formOpen}
        onClose={() => setFormOpen(false)}
      />
    </ScreenContainer>
  );
}
