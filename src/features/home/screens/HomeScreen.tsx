import React, { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Sparkles } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { monthTitle } from "../../../core/utils/Format";
import type { TxType } from "../../../core/types/Finance";
import {
  Card,
  EmptyState,
  ScreenContainer,
  SectionHeader,
} from "../../../components/ui";
import {
  TransactionFormSheet,
  TransactionListItem,
} from "../../../components/finance";

import {
  CashFlowCard,
  GoalsCarousel,
  InsightCard,
  NetWorthCard,
  QuickActions,
} from "../components";
import { useFinance } from "../../../core/hooks/useFinance";

export default function HomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { insights, transactions } = useFinance();

  const [formType, setFormType] = useState<TxType | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // TODO: reemplazar por la recarga real de datos
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <ScreenContainer
      title="Inicio"
      subtitle={monthTitle()}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      <NetWorthCard />
      <QuickActions onSelect={setFormType} />

      <View style={{ gap: theme.spacing.md }}>
        <SectionHeader title="Flujo de caja del mes" />
        <CashFlowCard />
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <SectionHeader
          title="Metas activas"
          actionLabel="Ver todas"
          onAction={() => navigation.navigate("Budgets")}
        />
        <GoalsCarousel onPressGoal={() => navigation.navigate("Budgets")} />
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <SectionHeader
          title="Alertas inteligentes"
          actionLabel="Preguntar a la IA"
          onAction={() => navigation.navigate("AIAdvisor")}
        />
        {insights.length ? (
          insights.map((i) => <InsightCard key={i.id} insight={i} />)
        ) : (
          <Card>
            <EmptyState
              icon={Sparkles}
              title="Todo en orden"
              description="Te avisaremos cuando detectemos algo importante en tus finanzas."
            />
          </Card>
        )}
      </View>

      <View style={{ gap: theme.spacing.xs }}>
        <SectionHeader
          title="Últimos movimientos"
          actionLabel="Ver todo"
          onAction={() => navigation.navigate("Transactions")}
        />
        <Card style={{ paddingVertical: theme.spacing.xs }}>
          {recent.map((t) => (
            <TransactionListItem
              key={t.id}
              tx={t}
              onPress={() => navigation.navigate("Transactions")}
            />
          ))}
        </Card>
      </View>

      <TransactionFormSheet
        visible={formType !== null}
        initialType={formType ?? "expense"}
        onClose={() => setFormType(null)}
      />
    </ScreenContainer>
  );
}
