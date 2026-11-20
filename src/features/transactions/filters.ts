import { CATEGORIES } from "../../core/constants/Categories";
import { Account, CategoryId, Transaction } from "../../core/types/Finance";
import { inMonth } from "../../core/utils/Finance";
import { parseDateInput } from "../../core/utils/Format";

export type TypeFilter = "all" | "income" | "expense" | "credit";
export type RangeFilter = "month" | "prev" | "custom";

export interface Filters {
  query: string;
  type: TypeFilter;
  category: CategoryId | null;
  range: RangeFilter;
  /** AAAA-MM-DD, solo con range === "custom" */
  from: string;
  to: string;
}

export const DEFAULT_FILTERS: Filters = {
  query: "",
  type: "all",
  category: null,
  range: "month",
  from: "",
  to: "",
};

export function applyFilters(
  txs: Transaction[],
  f: Filters,
  accounts: Account[],
): Transaction[] {
  const q = f.query.trim().toLowerCase();
  const from = f.range === "custom" ? parseDateInput(f.from) : null;
  const toRaw = f.range === "custom" ? parseDateInput(f.to) : null;
  const to = toRaw
    ? new Date(
        toRaw.getFullYear(),
        toRaw.getMonth(),
        toRaw.getDate(),
        23,
        59,
        59,
      )
    : null;

  return txs
    .filter((t) => {
      if (f.range === "month" && !inMonth(t.date, 0)) return false;
      if (f.range === "prev" && !inMonth(t.date, -1)) return false;
      if (from && new Date(t.date) < from) return false;
      if (to && new Date(t.date) > to) return false;

      if (f.type === "income" && t.type !== "income") return false;
      if (f.type === "expense" && t.type !== "expense") return false;
      if (f.type === "credit") {
        const acc = accounts.find((a) => a.id === t.accountId);
        if (acc?.type !== "credit_card") return false;
      }

      if (f.category && t.categoryId !== f.category) return false;

      if (q) {
        const hay =
          `${t.note} ${t.tags.join(" ")} ${CATEGORIES[t.categoryId].label}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
