import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Account,
  CategoryBudget,
  Goal,
  Loan,
  Preferences,
  Transaction,
} from "../types/Finance";
import { seed } from "../mocks/Finance";
import {
  balanceDelta,
  buildInsights,
  FIXED_CATEGORIES,
  loanStatus,
  monthSummary,
} from "../utils/Finance";
import { Ctx, FinanceValue, uid } from "../contexts/FinanceContext";
import { formatMoney, MoneyOptions } from "../utils/Format";
import { databaseService } from "../../services/databaseService";
import { useAuth } from "../hooks/useAuth";

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || "demo-user";

  const [accounts, setAccounts] = useState<Account[]>(seed.accounts);
  const [transactions, setTransactions] = useState<Transaction[]>(
    seed.transactions,
  );
  const [goals, setGoals] = useState<Goal[]>(seed.goals);
  const [budgets, setBudgets] = useState<CategoryBudget[]>(seed.budgets);
  const [loans, setLoans] = useState<Loan[]>(seed.loans);
  const [preferences, setPrefs] = useState<Preferences>(seed.preferences);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Cargar datos del usuario al cambiar de sesión o iniciar
  const loadUserData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const data = await databaseService.loadAllFinanceData(userId);
      setAccounts(data.accounts);
      setTransactions(data.transactions);
      setGoals(data.goals);
      setBudgets(data.budgets);
      setLoans(data.loans);
      setPrefs(data.preferences);
    } catch (e) {
      console.warn("Error loading user data in FinanceProvider:", e);
    } finally {
      setIsSyncing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Recarga manual para Pull-To-Refresh
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadUserData();
    setIsRefreshing(false);
  }, [loadUserData]);

  // ==========================================
  // ACCIONES TRANSACCIONES
  // ==========================================

  const addTransaction = useCallback(
    (t: Omit<Transaction, "id">) => {
      const full: Transaction = { ...t, id: uid() };

      // Actualización optimista de transacciones y saldo de cuentas
      setTransactions((p) => [full, ...p]);
      setAccounts((p) =>
        p.map((a) => {
          const delta = balanceDelta(a, full);
          const newBal = a.balance + delta;
          if (delta !== 0) {
            databaseService.updateAccountBalance(userId, a.id, newBal);
          }
          return { ...a, balance: newBal };
        }),
      );

      // Persistir transacción en base de datos
      databaseService.addTransaction(userId, full);
    },
    [userId],
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      const t = transactions.find((x) => x.id === id);
      if (!t) return;

      setTransactions((p) => p.filter((x) => x.id !== id));
      setAccounts((p) =>
        p.map((a) => {
          const delta = balanceDelta(a, t);
          const newBal = a.balance - delta;
          if (delta !== 0) {
            databaseService.updateAccountBalance(userId, a.id, newBal);
          }
          return { ...a, balance: newBal };
        }),
      );

      databaseService.deleteTransaction(userId, id);
    },
    [transactions, userId],
  );

  const updateTransaction = useCallback<FinanceValue["updateTransaction"]>(
    (id, patch) => {
      setTransactions((p) =>
        p.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
      databaseService.updateTransaction(userId, id, patch);
    },
    [userId],
  );

  // ==========================================
  // ACCIONES CUENTAS
  // ==========================================

  const addAccount = useCallback(
    (a: Omit<Account, "id">) => {
      const full: Account = { ...a, id: uid() };
      setAccounts((p) => [...p, full]);
      databaseService.addAccount(userId, full);
    },
    [userId],
  );

  const deleteAccount = useCallback(
    (id: string) => {
      setAccounts((p) => p.filter((a) => a.id !== id));
      databaseService.deleteAccount(userId, id);
    },
    [userId],
  );

  // ==========================================
  // ACCIONES METAS
  // ==========================================

  const addGoal = useCallback<FinanceValue["addGoal"]>(
    (g) => {
      const full: Goal = { saved: 0, ...g, id: uid() };
      setGoals((p) => [...p, full]);
      databaseService.addGoal(userId, full);
    },
    [userId],
  );

  const contributeToGoal = useCallback(
    (id: string, amount: number) => {
      setGoals((p) =>
        p.map((g) => {
          if (g.id === id) {
            const newSaved = Math.min(g.saved + amount, g.target);
            databaseService.updateGoalSaved(userId, id, newSaved);
            return { ...g, saved: newSaved };
          }
          return g;
        }),
      );
    },
    [userId],
  );

  const updateGoal = useCallback(
    (id: string, patch: Partial<Goal>) => {
      setGoals((p) => p.map((g) => (g.id === id ? { ...g, ...patch } : g)));
      databaseService.updateGoal(userId, id, patch);
    },
    [userId],
  );

  const deleteGoal = useCallback(
    (id: string) => {
      setGoals((p) => p.filter((g) => g.id !== id));
      databaseService.deleteGoal(userId, id);
    },
    [userId],
  );

  // ==========================================
  // ACCIONES PRESUPUESTOS
  // ==========================================

  const saveBudget = useCallback<FinanceValue["saveBudget"]>(
    (categoryId, limit) => {
      let budgetId = uid();
      setBudgets((p) => {
        const existing = p.find((b) => b.categoryId === categoryId);
        if (existing) {
          budgetId = existing.id;
          return p.map((b) =>
            b.categoryId === categoryId ? { ...b, limit } : b,
          );
        }
        return [...p, { id: budgetId, categoryId, limit }];
      });

      databaseService.saveBudget(userId, {
        id: budgetId,
        categoryId,
        limit,
      });
    },
    [userId],
  );

  const removeBudget = useCallback(
    (id: string) => {
      setBudgets((p) => p.filter((b) => b.id !== id));
      databaseService.deleteBudget(userId, id);
    },
    [userId],
  );

  // ==========================================
  // ACCIONES PRÉSTAMOS
  // ==========================================

  const addLoan = useCallback(
    (l: Omit<Loan, "id">) => {
      const full: Loan = { ...l, id: uid() };
      setLoans((p) => [...p, full]);
      databaseService.addLoan(userId, full);
    },
    [userId],
  );

  const payInstallment = useCallback(
    (id: string) => {
      setLoans((p) =>
        p.map((l) => {
          if (l.id === id) {
            const nextPaid = Math.min(l.paidInstallments + 1, l.termMonths);
            databaseService.updateLoanPaidInstallments(userId, id, nextPaid);
            return { ...l, paidInstallments: nextPaid };
          }
          return l;
        }),
      );
    },
    [userId],
  );

  const updateLoan = useCallback(
    (id: string, patch: Partial<Loan>) => {
      setLoans((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));
      databaseService.updateLoan(userId, id, patch);
    },
    [userId],
  );

  const deleteLoan = useCallback(
    (id: string) => {
      setLoans((p) => p.filter((l) => l.id !== id));
      databaseService.deleteLoan(userId, id);
    },
    [userId],
  );

  // ==========================================
  // PREFERENCIAS Y FORMATO
  // ==========================================

  const setPreferences = useCallback(
    (patch: Partial<Preferences>) => {
      setPrefs((p) => ({ ...p, ...patch }));
      databaseService.updatePreferences(userId, patch);
    },
    [userId],
  );

  const money = useCallback(
    (n: number, opts?: MoneyOptions) =>
      formatMoney(n, preferences.currency, opts),
    [preferences.currency],
  );

  // ==========================================
  // VALORES DERIVADOS
  // ==========================================
  const derived = useMemo(() => {
    const assets = accounts
      .filter((a) => a.type !== "credit_card")
      .reduce((s, a) => s + a.balance, 0);
    const cardDebt = accounts
      .filter((a) => a.type === "credit_card")
      .reduce((s, a) => s + a.balance, 0);
    const loanDebt = loans.reduce((s, l) => s + loanStatus(l).balance, 0);
    const month = monthSummary(transactions, 0);
    const prevMonth = monthSummary(transactions, -1);

    const fixedTx = FIXED_CATEGORIES.reduce(
      (s, c) => s + (month.byCategory[c] ?? 0),
      0,
    );
    const fixedExpenses =
      fixedTx + loans.reduce((s, l) => s + l.monthlyPayment, 0);
    const plannedSavings = goals.reduce((s, g) => s + g.monthlyContribution, 0);
    const freeToSpend = month.income - fixedExpenses - plannedSavings;
    const variableSpent = Math.max(month.expenses - fixedTx, 0);

    return {
      assets,
      liabilities: cardDebt + loanDebt,
      netWorth: assets - cardDebt - loanDebt,
      month,
      prevMonth,
      fixedExpenses,
      plannedSavings,
      freeToSpend,
      variableSpent,
    };
  }, [accounts, transactions, goals, loans]);

  const insights = useMemo(
    () =>
      buildInsights({
        cur: derived.month,
        prev: derived.prevMonth,
        budgets,
        loans,
        goals,
        money: (n) => formatMoney(n, preferences.currency, { decimals: 0 }),
      }),
    [
      derived.month,
      derived.prevMonth,
      budgets,
      loans,
      goals,
      preferences.currency,
    ],
  );

  const value: FinanceValue = {
    accounts,
    transactions,
    goals,
    budgets,
    loans,
    preferences,
    ...derived,
    insights,
    money,
    isRefreshing,
    isSyncing,
    refresh,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    deleteAccount,
    addGoal,
    contributeToGoal,
    updateGoal,
    deleteGoal,
    saveBudget,
    removeBudget,
    addLoan,
    payInstallment,
    updateLoan,
    deleteLoan,
    setPreferences,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
