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

  /* acciones */
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (
    id: string,
    patch: Partial<Pick<Transaction, "categoryId" | "note" | "tags">>,
  ) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (a: Omit<Account, "id">) => void;
  addGoal: (g: Omit<Goal, "id" | "saved"> & { saved?: number }) => void;
  contributeToGoal: (id: string, amount: number) => void;
  saveBudget: (categoryId: CategoryBudget["categoryId"], limit: number) => void;
  removeBudget: (id: string) => void;
  addLoan: (l: Omit<Loan, "id">) => void;
  payInstallment: (id: string) => void;
  setPreferences: (patch: Partial<Preferences>) => void;
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export const Ctx = createContext<FinanceValue | null>(null);
