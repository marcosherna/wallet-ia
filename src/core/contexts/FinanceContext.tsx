import type {
  Account,
  CategoryBudget,
  Goal,
  Insight,
  Loan,
  Preferences,
  Transaction,
} from "../types/Finance";
import { MoneyOptions } from "../utils/Format";
import { MonthSummary } from "../utils/Finance";
import { createContext } from "react";

export interface FinanceValue {
  accounts: Account[];
  transactions: Transaction[];
  goals: Goal[];
  budgets: CategoryBudget[];
  loans: Loan[];
  preferences: Preferences;

  /* derivados */
  assets: number;
  liabilities: number;
  netWorth: number;
  month: MonthSummary;
  prevMonth: MonthSummary;
  fixedExpenses: number;
  plannedSavings: number;
  freeToSpend: number;
  variableSpent: number;
  insights: Insight[];
  money: (n: number, opts?: MoneyOptions) => string;

  /* sincronización */
  isRefreshing: boolean;
  isSyncing: boolean;
  refresh: () => Promise<void>;

  /* acciones transacciones */
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (
    id: string,
    patch: Partial<Pick<Transaction, "categoryId" | "note" | "tags">>,
  ) => void;
  deleteTransaction: (id: string) => void;

  /* acciones cuentas */
  addAccount: (a: Omit<Account, "id">) => void;
  deleteAccount: (id: string) => void;

  /* acciones metas */
  addGoal: (g: Omit<Goal, "id" | "saved"> & { saved?: number }) => void;
  contributeToGoal: (id: string, amount: number) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  /* acciones presupuestos */
  saveBudget: (categoryId: CategoryBudget["categoryId"], limit: number) => void;
  removeBudget: (id: string) => void;

  /* acciones préstamos */
  addLoan: (l: Omit<Loan, "id">) => void;
  payInstallment: (id: string) => void;
  updateLoan: (id: string, patch: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;

  /* preferencias */
  setPreferences: (patch: Partial<Preferences>) => void;
}

export const uid = () =>
  "id-" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

export const Ctx = createContext<FinanceValue | null>(null);
