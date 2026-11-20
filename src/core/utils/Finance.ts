import type {
  Account,
  CategoryBudget,
  CategoryId,
  Goal,
  Insight,
  Loan,
  Transaction,
} from "../types/Finance";
import { CATEGORIES } from "../constants/Categories";

/* ───────── Fechas / resúmenes mensuales ───────── */

export const FIXED_CATEGORIES: CategoryId[] = [
  "housing",
  "utilities",
  "subscriptions",
];

export const startOfMonth = (offset = 0) => {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth() + offset, 1);
};

export const inMonth = (iso: string, offset: number) => {
  const d = new Date(iso);
  return d >= startOfMonth(offset) && d < startOfMonth(offset + 1);
};

export interface MonthSummary {
  income: number;
  expenses: number;
  byCategory: Partial<Record<CategoryId, number>>;
}

export function monthSummary(txs: Transaction[], offset: number): MonthSummary {
  const out: MonthSummary = { income: 0, expenses: 0, byCategory: {} };
  txs.forEach((t) => {
    if (!inMonth(t.date, offset)) return;
    if (t.type === "income") out.income += t.amount;
    if (t.type === "expense") {
      out.expenses += t.amount;
      out.byCategory[t.categoryId] =
        (out.byCategory[t.categoryId] ?? 0) + t.amount;
    }
  });
  return out;
}

export const monthsUntil = (iso: string) => {
  const now = new Date();
  const d = new Date(iso);
  return Math.max(
    1,
    (d.getFullYear() - now.getFullYear()) * 12 + d.getMonth() - now.getMonth(),
  );
};

export const addMonthsISO = (months: number) => {
  const n = new Date();
  return new Date(
    n.getFullYear(),
    n.getMonth() + months,
    Math.min(n.getDate(), 28),
  ).toISOString();
};

/* ───────── Saldos ───────── */

/** Cuánto cambia el saldo de `acc` por la transacción `tx`. */
export function balanceDelta(acc: Account, tx: Transaction): number {
  const card = acc.type === "credit_card";
  if (tx.type === "income" && acc.id === tx.accountId)
    return card ? -tx.amount : tx.amount;
  if (tx.type === "expense" && acc.id === tx.accountId)
    return card ? tx.amount : -tx.amount;
  if (tx.type === "transfer") {
    if (acc.id === tx.accountId) return card ? tx.amount : -tx.amount;
    if (acc.id === tx.toAccountId) return card ? -tx.amount : tx.amount;
  }
  return 0;
}

/* ───────── Créditos ───────── */

export function calcInstallment(
  principal: number,
  apr: number,
  months: number,
): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = apr / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export interface LoanStatus {
  balance: number;
  principalPaid: number;
  interestPaid: number;
  remaining: number;
  progress: number;
  totalInterest: number;
  nextPayment: Date;
}

export function loanStatus(loan: Loan): LoanStatus {
  const r = loan.apr / 100 / 12;
  let balance = loan.principal;
  let principalPaid = 0;
  let interestPaid = 0;
  const paid = Math.min(loan.paidInstallments, loan.termMonths);
  for (let i = 0; i < paid; i++) {
    const interest = balance * r;
    const capital = Math.min(
      Math.max(loan.monthlyPayment - interest, 0),
      balance,
    );
    interestPaid += interest;
    principalPaid += capital;
    balance -= capital;
  }
  const now = new Date();
  let next = new Date(now.getFullYear(), now.getMonth(), loan.paymentDay);
  if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    next = new Date(now.getFullYear(), now.getMonth() + 1, loan.paymentDay);
  }
  return {
    balance: Math.max(balance, 0),
    principalPaid,
    interestPaid,
    remaining: loan.termMonths - paid,
    progress: loan.termMonths ? paid / loan.termMonths : 0,
    totalInterest: Math.max(
      loan.monthlyPayment * loan.termMonths - loan.principal,
      0,
    ),
    nextPayment: next,
  };
}

/* ───────── Simulador de metas ───────── */

export type Verdict = "viable" | "viable_adjusting" | "risky" | "impossible";

export interface GoalEvaluation {
  verdict: Verdict;
  requiredMonthly: number;
  /** Ajuste mensual en ocio para que sea viable. */
  adjustment: number;
  /** Plazo sugerido (meses) cuando es riesgoso o imposible. */
  suggestedMonths: number;
}

export function evaluateGoal(opts: {
  target: number;
  saved?: number;
  months: number;
  freeCash: number;
  leisureSpend: number;
}): GoalEvaluation {
  const { target, saved = 0, months, freeCash, leisureSpend } = opts;
  const requiredMonthly = Math.max(target - saved, 0) / Math.max(months, 1);
  const comfortable = Math.max(freeCash, 0) * 0.8;
  const suggestedMonths = Math.ceil(
    Math.max(target - saved, 0) / Math.max(comfortable, 1),
  );

  if (requiredMonthly <= comfortable)
    return {
      verdict: "viable",
      requiredMonthly,
      adjustment: 0,
      suggestedMonths,
    };
  if (requiredMonthly <= freeCash)
    return {
      verdict: "risky",
      requiredMonthly,
      adjustment: 0,
      suggestedMonths,
    };
  const gap = requiredMonthly - Math.max(freeCash, 0);
  if (gap <= leisureSpend * 0.5)
    return {
      verdict: "viable_adjusting",
      requiredMonthly,
      adjustment: gap,
      suggestedMonths,
    };
  return {
    verdict: "impossible",
    requiredMonthly,
    adjustment: gap,
    suggestedMonths,
  };
}

/* ───────── Escenarios ───────── */

export function simulateScenario(opts: {
  income: number;
  discretionary: number;
  incomeBoostPct: number;
  cutPct: number;
}) {
  const extraIncome = opts.income * (opts.incomeBoostPct / 100);
  const saved = opts.discretionary * (opts.cutPct / 100);
  const monthly = extraIncome + saved;
  return { extraIncome, saved, monthly, yearly: monthly * 12 };
}

/* ───────── Alertas inteligentes ───────── */

export function buildInsights(args: {
  cur: MonthSummary;
  prev: MonthSummary;
  budgets: CategoryBudget[];
  loans: Loan[];
  goals: Goal[];
  money: (n: number) => string;
}): Insight[] {
  const { cur, prev, budgets, loans, goals, money } = args;
  const out: Insight[] = [];

  (Object.keys(cur.byCategory) as CategoryId[]).forEach((cat) => {
    const now = cur.byCategory[cat] ?? 0;
    const before = prev.byCategory[cat] ?? 0;
    if (before > 0 && now > before * 1.1 && now - before >= 20) {
      out.push({
        id: `inc-${cat}`,
        tone: "warning",
        title: `Más gasto en ${CATEGORIES[cat].label}`,
        message: `Has gastado un ${Math.round((now / before - 1) * 100)}% más que el mes pasado (${money(now)} vs ${money(before)}).`,
      });
    }
  });

  budgets.forEach((b) => {
    const ratio = (cur.byCategory[b.categoryId] ?? 0) / b.limit;
    if (ratio >= 0.9) {
      out.push({
        id: `bud-${b.id}`,
        tone: "danger",
        title: `Límite de ${CATEGORIES[b.categoryId].label} casi agotado`,
        message: `Llevas ${Math.round(ratio * 100)}% de tu tope mensual de ${money(b.limit)}.`,
      });
    }
  });

  loans.forEach((l) => {
    const days = Math.ceil(
      (loanStatus(l).nextPayment.getTime() - Date.now()) / 86400000,
    );
    if (days >= 0 && days <= 5) {
      out.push({
        id: `loan-${l.id}`,
        tone: "info",
        title: `Pago próximo: ${l.name}`,
        message: `Tu cuota de ${money(l.monthlyPayment)} vence ${days === 0 ? "hoy" : `en ${days} día${days === 1 ? "" : "s"}`}.`,
      });
    }
  });

  goals.forEach((g) => {
    if (g.target > 0 && g.saved / g.target >= 0.4) {
      out.push({
        id: `goal-${g.id}`,
        tone: "success",
        title: `Buen avance en "${g.name}"`,
        message: `Ya llevas el ${Math.round((g.saved / g.target) * 100)}% de tu meta.`,
      });
    }
  });

  return out.slice(0, 4);
}
