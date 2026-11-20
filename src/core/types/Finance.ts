export type TxType = "income" | "expense" | "transfer";

export type CategoryId =
  | "housing"
  | "food"
  | "transport"
  | "utilities"
  | "leisure"
  | "health"
  | "education"
  | "subscriptions"
  | "income"
  | "other";

export type AccountType = "checking" | "savings" | "cash" | "credit_card";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  /** Para tarjetas de crédito es la deuda actual (número positivo). */
  balance: number;
  institution?: string;
}

export interface Transaction {
  id: string;
  type: TxType;
  /** Siempre positivo. */
  amount: number;
  categoryId: CategoryId;
  accountId: string;
  toAccountId?: string;
  note: string;
  tags: string[];
  /** ISO 8601 */
  date: string;
}

export type GoalIconId =
  | "target"
  | "car"
  | "travel"
  | "home"
  | "education"
  | "emergency";

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  icon: GoalIconId;
  monthlyContribution: number;
}

export interface CategoryBudget {
  id: string;
  categoryId: CategoryId;
  limit: number;
}

export type LoanKind = "mortgage" | "auto" | "personal" | "other";

export interface Loan {
  id: string;
  name: string;
  kind: LoanKind;
  principal: number;
  /** Tasa anual en %. */
  apr: number;
  termMonths: number;
  monthlyPayment: number;
  /** Día del mes de corte/pago (1-31). */
  paymentDay: number;
  paidInstallments: number;
}

export type CurrencyCode = "USD" | "EUR" | "MXN" | "COP" | "GTQ";
export type ThemeMode = "light" | "dark" | "system";

export interface Preferences {
  currency: CurrencyCode;
  biometrics: boolean;
  pinEnabled: boolean;
  notifications: boolean;
  themeMode: ThemeMode;
}

export type InsightTone = "success" | "warning" | "danger" | "info";

export interface Insight {
  id: string;
  tone: InsightTone;
  title: string;
  message: string;
}
