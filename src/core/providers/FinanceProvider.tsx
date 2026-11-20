import { createContext, useCallback, useMemo, useState } from "react";
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

/**
 * Estado global de la app con datos de ejemplo.
 * Sustituye `seed` por tu API / base local cuando la tengas.
 */
export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(seed.accounts);
  const [transactions, setTransactions] = useState<Transaction[]>(
    seed.transactions,
  );
  const [goals, setGoals] = useState<Goal[]>(seed.goals);
  const [budgets, setBudgets] = useState<CategoryBudget[]>(seed.budgets);
  const [loans, setLoans] = useState<Loan[]>(seed.loans);
  const [preferences, setPrefs] = useState<Preferences>(seed.preferences);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    const full: Transaction = { ...t, id: uid() };
    setTransactions((p) => [full, ...p]);
    setAccounts((p) =>
      p.map((a) => ({ ...a, balance: a.balance + balanceDelta(a, full) })),
    );
  }, []);

  const deleteTransaction = useCallback(
    (id: string) => {
      const t = transactions.find((x) => x.id === id);
      if (!t) return;
      setTransactions((p) => p.filter((x) => x.id !== id));
      setAccounts((p) =>
        p.map((a) => ({ ...a, balance: a.balance - balanceDelta(a, t) })),
      );
    },
    [transactions],
  );

  const updateTransaction = useCallback<FinanceValue["updateTransaction"]>(
    (id, patch) => {
      setTransactions((p) =>
        p.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
    },
    [],
  );

  const addAccount = useCallback(
    (a: Omit<Account, "id">) => setAccounts((p) => [...p, { ...a, id: uid() }]),
    [],
  );
  const addGoal = useCallback<FinanceValue["addGoal"]>(
    (g) => setGoals((p) => [...p, { saved: 0, ...g, id: uid() }]),
    [],
  );
  const contributeToGoal = useCallback((id: string, amount: number) => {
    setGoals((p) =>
      p.map((g) =>
        g.id === id ? { ...g, saved: Math.min(g.saved + amount, g.target) } : g,
      ),
    );
  }, []);

  const saveBudget = useCallback<FinanceValue["saveBudget"]>(
    (categoryId, limit) => {
      setBudgets((p) =>
        p.some((b) => b.categoryId === categoryId)
          ? p.map((b) => (b.categoryId === categoryId ? { ...b, limit } : b))
          : [...p, { id: uid(), categoryId, limit }],
      );
    },
    [],
  );
  const removeBudget = useCallback(
    (id: string) => setBudgets((p) => p.filter((b) => b.id !== id)),
    [],
  );

  const addLoan = useCallback(
    (l: Omit<Loan, "id">) => setLoans((p) => [...p, { ...l, id: uid() }]),
    [],
  );
  const payInstallment = useCallback((id: string) => {
    setLoans((p) =>
      p.map((l) =>
        l.id === id
          ? {
              ...l,
              paidInstallments: Math.min(l.paidInstallments + 1, l.termMonths),
            }
          : l,
      ),
    );
  }, []);

  const setPreferences = useCallback(
    (patch: Partial<Preferences>) => setPrefs((p) => ({ ...p, ...patch })),
    [],
  );

  const money = useCallback(
    (n: number, opts?: MoneyOptions) =>
      formatMoney(n, preferences.currency, opts),
    [preferences.currency],
  );

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
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    addGoal,
    contributeToGoal,
    saveBudget,
    removeBudget,
    addLoan,
    payInstallment,
    setPreferences,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
