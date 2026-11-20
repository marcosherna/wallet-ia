import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Plus, Target, Gauge } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import {
  Button,
  Card,
  EmptyState,
  Label,
  ScreenContainer,
  SegmentedControl,
} from "../../../components/ui";

import {
  BudgetCard,
  BudgetFormSheet,
  ContributeSheet,
  GoalCard,
  GoalFormSheet,
} from "../components";
import { useFinance } from "../../../core/hooks/useFinance";
import { CategoryBudget, Goal } from "../../../core/types/Finance";

type Tab = "goals" | "budgets";

export default function BudgetsScreen() {
  const { theme } = useTheme();
  const { goals, budgets, money, isRefreshing, refresh, deleteGoal } =
    useFinance();

  const [tab, setTab] = useState<Tab>("goals");
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [contributing, setContributing] = useState<Goal | null>(null);
  const [budgetFormOpen, setBudgetFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<CategoryBudget | null>(
    null,
  );

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  const openBudgetForm = (b: CategoryBudget | null) => {
    setEditingBudget(b);
    setBudgetFormOpen(true);
  };

  const handleDeleteGoal = (goal: Goal) => {
    Alert.alert(
      "Eliminar meta",
      `¿Deseas eliminar la meta "${goal.name}"? Los fondos acumulados no se perderán de tus cuentas.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteGoal(goal.id),
        },
      ],
    );
  };

  return (
    <ScreenContainer
      title="Metas"
      subtitle="Convierte tus planes en un ahorro realista"
      refreshing={isRefreshing}
      onRefresh={refresh}
      headerRight={
        <Button
          title="Nueva"
          size="sm"
          leftIcon={Plus}
          onPress={() =>
            tab === "goals" ? setGoalFormOpen(true) : openBudgetForm(null)
          }
        />
      }
    >
      <SegmentedControl
        options={[
          { id: "goals" as Tab, label: "Metas de ahorro" },
          { id: "budgets" as Tab, label: "Presupuestos" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "goals" ? (
        <>
          {goals.length > 0 && (
            <Card variant="muted" style={{ gap: 2 }}>
              <Label size="sm" color={theme.colors.textSecondary}>
                Total ahorrado en metas
              </Label>
              <Label size="xl" weight="bold">
                {money(totalSaved, { decimals: 0 })}
              </Label>
              <Label size="xs" color={theme.colors.textSecondary}>
                de {money(totalTarget, { decimals: 0 })} en {goals.length} metas
              </Label>
            </Card>
          )}
          {goals.length === 0 ? (
            <EmptyState
              icon={Target}
              title="Aún no tienes metas"
              description="Crea una y calculamos cuánto necesitas ahorrar cada mes."
              actionLabel="Crear mi primera meta"
              onAction={() => setGoalFormOpen(true)}
            />
          ) : (
            <View style={{ gap: theme.spacing.md }}>
              {goals.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  onContribute={setContributing}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </View>
          )}
        </>
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={Gauge}
          title="Sin presupuestos"
          description="Define un tope mensual por categoría y recibe alertas antes de pasarte."
          actionLabel="Crear presupuesto"
          onAction={() => openBudgetForm(null)}
        />
      ) : (
        <View style={{ gap: theme.spacing.md }}>
          {budgets.map((b) => (
            <BudgetCard key={b.id} budget={b} onPress={openBudgetForm} />
          ))}
        </View>
      )}

      <GoalFormSheet
        visible={goalFormOpen}
        onClose={() => setGoalFormOpen(false)}
      />
      <ContributeSheet
        goal={contributing}
        onClose={() => setContributing(null)}
      />
      <BudgetFormSheet
        visible={budgetFormOpen}
        editing={editingBudget}
        onClose={() => setBudgetFormOpen(false)}
      />
    </ScreenContainer>
  );
}
