import type { CurrencyCode } from "../types/Finance";

const SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  MXN: "$",
  COP: "$",
  GTQ: "Q",
};

export const CURRENCIES: { code: CurrencyCode; label: string }[] = [
  { code: "USD", label: "Dólar estadounidense ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "MXN", label: "Peso mexicano ($)" },
  { code: "COP", label: "Peso colombiano ($)" },
  { code: "GTQ", label: "Quetzal (Q)" },
];

const group = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export interface MoneyOptions {
  decimals?: number;
  sign?: boolean;
  compact?: boolean;
}

export function formatMoney(
  amount: number,
  currency: CurrencyCode = "USD",
  { decimals = 2, sign = false, compact = false }: MoneyOptions = {},
): string {
  const abs = Math.abs(amount);
  let body: string;
  if (compact && abs >= 1000) {
    body = `${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  } else {
    const [i, d] = abs.toFixed(decimals).split(".");
    body = d ? `${group(i)}.${d}` : group(i);
  }
  const prefix = amount < 0 ? "-" : sign && amount > 0 ? "+" : "";
  return `${prefix}${SYMBOLS[currency]}${body}`;
}

export const MONTHS_SHORT = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];
export const MONTHS_LONG = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const formatShortDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
};

export const formatLongDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} de ${MONTHS_LONG[d.getMonth()]} de ${d.getFullYear()}`;
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export function formatDayGroup(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  if (sameDay(d, now)) return "Hoy";
  if (sameDay(d, yesterday)) return "Ayer";
  return formatShortDate(iso);
}

export const monthTitle = (offset = 0) => {
  const d = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + offset,
    1,
  );
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
};

/** Convierte "AAAA-MM-DD" en Date válido o null. */
export function parseDateInput(text: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d.getTime()) ? null : d;
}

/** Deja solo dígitos y un punto decimal (máx. 2 decimales). */
export function sanitizeAmount(text: string): string {
  const cleaned = text.replace(/[^0-9.]/g, "");
  const [i, ...rest] = cleaned.split(".");
  return rest.length ? `${i}.${rest.join("").slice(0, 2)}` : i;
}
