import {
  ArrowLeftRight,
  Banknote,
  Building2,
  Car,
  CreditCard,
  GraduationCap,
  Gamepad2,
  HeartPulse,
  Home as HomeIcon,
  Landmark,
  MoreHorizontal,
  PiggyBank,
  Plane,
  Repeat,
  ShieldCheck,
  Target,
  Utensils,
  Zap,
  Wallet,
} from "lucide-react-native";
import type { IconComponent } from "../../components/ui/types";
import type {
  AccountType,
  CategoryId,
  GoalIconId,
  LoanKind,
} from "../types/Finance";

export const CATEGORIES: Record<
  CategoryId,
  { label: string; icon: IconComponent }
> = {
  housing: { label: "Vivienda", icon: HomeIcon },
  food: { label: "Alimentación", icon: Utensils },
  transport: { label: "Transporte", icon: Car },
  utilities: { label: "Servicios", icon: Zap },
  leisure: { label: "Ocio", icon: Gamepad2 },
  health: { label: "Salud", icon: HeartPulse },
  education: { label: "Educación", icon: GraduationCap },
  subscriptions: { label: "Suscripciones", icon: Repeat },
  income: { label: "Ingresos", icon: Wallet },
  other: { label: "Otros", icon: MoreHorizontal },
};

export const TRANSFER_ICON: IconComponent = ArrowLeftRight;

export const EXPENSE_CATEGORIES: CategoryId[] = [
  "housing",
  "food",
  "transport",
  "utilities",
  "leisure",
  "health",
  "education",
  "subscriptions",
  "other",
];

export const ACCOUNT_TYPES: Record<
  AccountType,
  { label: string; icon: IconComponent }
> = {
  checking: { label: "Cuenta corriente", icon: Landmark },
  savings: { label: "Ahorros", icon: PiggyBank },
  cash: { label: "Efectivo", icon: Banknote },
  credit_card: { label: "Tarjeta de crédito", icon: CreditCard },
};

export const GOAL_ICONS: Record<
  GoalIconId,
  { label: string; icon: IconComponent }
> = {
  target: { label: "General", icon: Target },
  car: { label: "Auto", icon: Car },
  travel: { label: "Viaje", icon: Plane },
  home: { label: "Hogar", icon: HomeIcon },
  education: { label: "Estudios", icon: GraduationCap },
  emergency: { label: "Emergencia", icon: ShieldCheck },
};

export const LOAN_KINDS: Record<
  LoanKind,
  { label: string; icon: IconComponent }
> = {
  mortgage: { label: "Hipotecario", icon: Building2 },
  auto: { label: "Automotriz", icon: Car },
  personal: { label: "Personal", icon: Wallet },
  other: { label: "Otro", icon: Landmark },
};
