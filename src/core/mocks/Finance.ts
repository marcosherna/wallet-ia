import type {
  Account,
  CategoryBudget,
  CategoryId,
  Goal,
  Loan,
  Preferences,
  Transaction,
  TxType,
} from "../types/Finance";
import { addMonthsISO, calcInstallment } from "../utils/Finance";

/** Fecha en el mes `offset`, día `day` (limitada a hoy en el mes actual). */
const at = (offset: number, day: number) => {
  const n = new Date();
  const last = new Date(
    n.getFullYear(),
    n.getMonth() + offset + 1,
    0,
  ).getDate();
  const d = Math.min(day, offset === 0 ? n.getDate() : last);
  return new Date(n.getFullYear(), n.getMonth() + offset, d, 12).toISOString();
};

let seq = 0;
const tx = (
  offset: number,
  day: number,
  type: TxType,
  amount: number,
  categoryId: CategoryId,
  accountId: string,
  note: string,
  tags: string[] = [],
  toAccountId?: string,
): Transaction => ({
  id: `seed-${++seq}`,
  type,
  amount,
  categoryId,
  accountId,
  toAccountId,
  note,
  tags,
  date: at(offset, day),
});

const autoPayment = Number(calcInstallment(12000, 9.5, 48).toFixed(2));

export const seed = {
  accounts: [
    {
      id: "a1",
      name: "Cuenta corriente",
      type: "checking",
      balance: 2450.75,
      institution: "Banco principal",
    },
    {
      id: "a2",
      name: "Ahorros",
      type: "savings",
      balance: 4200,
      institution: "Banco principal",
    },
    { id: "a3", name: "Efectivo", type: "cash", balance: 180 },
    {
      id: "a4",
      name: "Tarjeta Visa",
      type: "credit_card",
      balance: 640,
      institution: "Banco principal",
    },
  ] as Account[],

  transactions: [
    tx(0, 1, "income", 2500, "income", "a1", "Salario", ["trabajo"]),
    tx(0, 2, "expense", 650, "housing", "a1", "Alquiler", ["fijo"]),
    tx(0, 3, "expense", 74.5, "utilities", "a1", "Electricidad e internet", [
      "fijo",
    ]),
    tx(0, 4, "expense", 15.99, "subscriptions", "a4", "Streaming de video", [
      "fijo",
    ]),
    tx(0, 5, "expense", 98.3, "food", "a1", "Supermercado", ["hogar"]),
    tx(0, 6, "expense", 45, "transport", "a3", "Combustible"),
    tx(0, 8, "expense", 62, "leisure", "a4", "Cena con amigos", ["social"]),
    tx(0, 9, "expense", 120, "leisure", "a4", "Concierto", ["social"]),
    tx(0, 10, "expense", 34.2, "food", "a3", "Almuerzos de la semana"),
    tx(0, 12, "expense", 58, "health", "a1", "Consulta médica"),
    tx(0, 14, "expense", 85, "leisure", "a4", "Videojuego y accesorios"),
    tx(0, 15, "expense", 36.5, "food", "a1", "Delivery"),
    tx(0, 16, "transfer", 200, "other", "a1", "Ahorro mensual", [], "a2"),
    tx(0, 17, "expense", 22, "transport", "a3", "Taxi"),
    tx(-1, 1, "income", 2500, "income", "a1", "Salario", ["trabajo"]),
    tx(-1, 2, "income", 180, "income", "a1", "Trabajo freelance", ["extra"]),
    tx(-1, 2, "expense", 650, "housing", "a1", "Alquiler", ["fijo"]),
    tx(-1, 3, "expense", 71, "utilities", "a1", "Electricidad e internet", [
      "fijo",
    ]),
    tx(-1, 4, "expense", 15.99, "subscriptions", "a4", "Streaming de video", [
      "fijo",
    ]),
    tx(-1, 7, "expense", 210, "food", "a1", "Supermercado y delivery"),
    tx(-1, 11, "expense", 95, "transport", "a3", "Combustible y taxis"),
    tx(-1, 14, "expense", 140, "leisure", "a4", "Salidas y cine", ["social"]),
    tx(-1, 20, "expense", 40, "health", "a1", "Farmacia"),
    tx(-1, 25, "expense", 60, "education", "a1", "Curso en línea", ["estudio"]),
  ] as Transaction[],

  goals: [
    {
      id: "g1",
      name: "Fondo de emergencia",
      target: 5000,
      saved: 2100,
      deadline: addMonthsISO(8),
      icon: "emergency",
      monthlyContribution: 250,
    },
    {
      id: "g2",
      name: "Comprar un carro",
      target: 8000,
      saved: 900,
      deadline: addMonthsISO(20),
      icon: "car",
      monthlyContribution: 200,
    },
    {
      id: "g3",
      name: "Viaje de verano",
      target: 1500,
      saved: 400,
      deadline: addMonthsISO(6),
      icon: "travel",
      monthlyContribution: 150,
    },
  ] as Goal[],

  budgets: [
    { id: "b1", categoryId: "food", limit: 300 },
    { id: "b2", categoryId: "leisure", limit: 250 },
    { id: "b3", categoryId: "transport", limit: 150 },
  ] as CategoryBudget[],

  loans: [
    {
      id: "l1",
      name: "Crédito del auto",
      kind: "auto",
      principal: 12000,
      apr: 9.5,
      termMonths: 48,
      monthlyPayment: autoPayment,
      paymentDay: Math.min(new Date().getDate() + 2, 28),
      paidInstallments: 14,
    },
  ] as Loan[],

  preferences: {
    currency: "USD",
    biometrics: true,
    pinEnabled: false,
    notifications: true,
    themeMode: "system",
  } as Preferences,
};
