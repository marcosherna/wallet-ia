import { useContext } from "react";
import { Ctx, FinanceValue } from "../contexts/FinanceContext";

export function useFinance(): FinanceValue {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useFinance debe usarse dentro de <FinanceProvider>");
  return ctx;
}
