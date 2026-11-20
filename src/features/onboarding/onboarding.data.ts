import {
  Briefcase,
  Clock,
  CreditCard,
  GraduationCap,
  Landmark,
  Laptop,
  ShieldCheck,
  Store,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react-native";
import { IconComponent } from "../../components/ui/types";

export type JobStatus =
  | "Employed_Full"
  | "Employed_Part"
  | "Freelance"
  | "Business_Owner"
  | "Unemployed"
  | "Retired";

export type PrimaryGoal = "emergency" | "control" | "asset" | "debt" | "invest";

// Tipado del perfil financiero temporal
export interface FinancialProfile {
  jobStatus: JobStatus | "";
  monthlyIncome: string;
  primaryGoal: PrimaryGoal | "";
}

export interface OnboardingOption<T extends string> {
  id: T;
  title: string;
  description: string;
  icon: IconComponent;
}

export const TOTAL_STEPS = 3;

export const JOB_OPTIONS: OnboardingOption<JobStatus>[] = [
  {
    id: "Employed_Full",
    title: "Empleado a tiempo completo",
    description: "Ingreso fijo y recurrente",
    icon: Briefcase,
  },
  {
    id: "Employed_Part",
    title: "Empleado a medio tiempo",
    description: "Ingreso fijo con jornada reducida",
    icon: Clock,
  },
  {
    id: "Freelance",
    title: "Independiente",
    description: "Ingresos variables por proyecto",
    icon: Laptop,
  },
  {
    id: "Business_Owner",
    title: "Dueño de negocio",
    description: "Ingresos de tu propia empresa",
    icon: Store,
  },
  {
    id: "Unemployed",
    title: "Estudiante o sin empleo actual",
    description: "Ingresos limitados u ocasionales",
    icon: GraduationCap,
  },
  {
    id: "Retired",
    title: "Jubilado o pensionado",
    description: "Ingreso por pensión o ahorros",
    icon: Landmark,
  },
];

export const GOAL_OPTIONS: OnboardingOption<PrimaryGoal>[] = [
  {
    id: "emergency",
    title: "Crear un fondo de emergencia",
    description: "Cubre imprevistos sin endeudarte",
    icon: ShieldCheck,
  },
  {
    id: "control",
    title: "Controlar mis gastos diarios",
    description: "Entiende en qué se va tu dinero",
    icon: Wallet,
  },
  {
    id: "asset",
    title: "Ahorrar para una gran compra",
    description: "Vehículo, vivienda o un proyecto personal",
    icon: Target,
  },
  {
    id: "debt",
    title: "Salir de deudas",
    description: "Ordena y reduce tus pagos pendientes",
    icon: CreditCard,
  },
  {
    id: "invest",
    title: "Empezar a invertir",
    description: "Haz crecer tu dinero a largo plazo",
    icon: TrendingUp,
  },
];

export const INCOME_SUGGESTIONS = [300, 600, 1000, 2000];
