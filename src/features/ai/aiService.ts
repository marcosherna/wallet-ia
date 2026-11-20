import { CATEGORIES } from "../../core/constants/Categories";
import {
  Account,
  CategoryBudget,
  CategoryId,
  Goal,
  Loan,
} from "../../core/types/Finance";
import { MonthSummary } from "../../core/utils/Finance";

/** Datos que el asesor puede ver. Nunca incluyas credenciales ni PIN. */
export interface AdvisorContext {
  netWorth: number;
  freeToSpend: number;
  variableSpent: number;
  month: MonthSummary;
  accounts: Account[];
  goals: Goal[];
  loans: Loan[];
  budgets: CategoryBudget[];
  money: (n: number, opts?: { decimals?: number }) => string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export const SUGGESTED_PROMPTS = [
  "¿Puedo permitirme comprar este artículo de $300 este mes?",
  "¿En dónde se me está fugando más dinero?",
  "Dame un plan de 3 pasos para salir de mis deudas de tarjeta de crédito.",
];

/**
 * Respuesta local basada en reglas, para poder probar la interfaz.
 * TODO: reemplazar por una llamada a tu backend / API de IA enviando `ctx` como contexto.
 */
export async function askAdvisor(
  prompt: string,
  ctx: AdvisorContext,
): Promise<string> {
  await new Promise((r) => setTimeout(r, 900));
  const text = prompt.toLowerCase();
  const { money } = ctx;
  const remaining = ctx.freeToSpend - ctx.variableSpent;

  const amountMatch = /\$\s?(\d+(?:[.,]\d+)?)/.exec(prompt);
  if (amountMatch && /(permit|compr|puedo|gastar)/.test(text)) {
    const amount = Number(amountMatch[1].replace(",", "."));
    if (remaining <= 0) {
      return `Este mes ya usaste todo tu dinero libre para gastar. Una compra de ${money(amount)} te dejaría en negativo; te conviene esperar al próximo mes.`;
    }
    if (amount <= remaining * 0.5) {
      return `Sí. Te quedan ${money(remaining)} de dinero libre y esta compra usaría el ${Math.round((amount / remaining) * 100)}%. Puedes hacerla sin afectar tus metas.`;
    }
    if (amount <= remaining) {
      return `Es posible, pero te dejaría con ${money(remaining - amount)} para el resto del mes. Si no es urgente, considera esperar o dividirla en dos meses.`;
    }
    return `No este mes: te quedan ${money(remaining)} de dinero libre y la compra es de ${money(amount)}. Tendrías que recortar de tus metas o pagar con tarjeta, lo que aumentaría tu deuda.`;
  }

  if (/(fuga|fugando|dónde|donde|hormiga|más dinero|mas dinero)/.test(text)) {
    const entries = (
      Object.entries(ctx.month.byCategory) as [CategoryId, number][]
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    if (!entries.length)
      return "Aún no tengo gastos de este mes para analizar.";
    const lines = entries.map(
      ([c, v]) =>
        `• ${CATEGORIES[c].label}: ${money(v)} (${Math.round((v / ctx.month.expenses) * 100)}% de tus egresos)`,
    );
    return `Estas son tus categorías con más gasto este mes:\n${lines.join("\n")}\n\nSi buscas recortar sin sentirlo, empieza por Ocio y Suscripciones: suelen tener más margen que Vivienda o Servicios.`;
  }

  if (/(deuda|tarjeta|crédito|credito|préstamo|prestamo)/.test(text)) {
    const card = ctx.accounts
      .filter((a) => a.type === "credit_card")
      .reduce((s, a) => s + a.balance, 0);
    const extra = Math.max(Math.round(Math.max(remaining, 0) * 0.5), 0);
    return `Plan en 3 pasos:\n1. Deja de usar la tarjeta mientras tengas saldo (${money(card)}).\n2. Destina ${money(extra)} al mes de tu dinero libre como pago extra, además del mínimo.\n3. Cuando la tarjeta llegue a cero, redirige ese monto a tu fondo de emergencia.\n\nCon el pago extra liquidarías la tarjeta en ${extra > 0 ? Math.ceil(card / extra) : "—"} mes(es).`;
  }

  return `Resumen rápido: tu patrimonio neto es ${money(ctx.netWorth)}, tienes ${money(Math.max(remaining, 0))} libres para gastar este mes y ${ctx.goals.length} metas activas. Puedes preguntarme si puedes hacer una compra, dónde se va tu dinero o cómo salir de deudas.`;
}
