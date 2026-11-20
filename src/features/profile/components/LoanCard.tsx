import React from "react";
import { View } from "react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Card, IconBadge, Label, ProgressBar } from "../../../components/ui";
import { Loan } from "../../../core/types/Finance";
import { useFinance } from "../../../core/hooks/useFinance";
import { loanStatus } from "../../../core/utils/Finance";
import { LOAN_KINDS } from "../../../core/constants/Categories";
import { formatShortDate } from "../../../core/utils/Format";

export function LoanCard({
  loan,
  onPress,
}: {
  loan: Loan;
  onPress: (l: Loan) => void;
}) {
  const { theme } = useTheme();
  const { money } = useFinance();
  const s = loanStatus(loan);

  return (
    <Card onPress={() => onPress(loan)} style={{ gap: theme.spacing.md }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.md,
        }}
      >
        <IconBadge icon={LOAN_KINDS[loan.kind].icon} />
        <View style={{ flex: 1 }}>
          <Label size="md" weight="bold">
            {loan.name}
          </Label>
          <Label size="xs" color={theme.colors.textSecondary}>
            Cuota {money(loan.monthlyPayment)} · próximo pago{" "}
            {formatShortDate(s.nextPayment.toISOString())}
          </Label>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <ProgressBar value={s.progress} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Label size="xs" color={theme.colors.textSecondary}>
            {loan.paidInstallments} de {loan.termMonths} cuotas
          </Label>
          <Label size="xs" weight="semibold">
            Saldo: {money(s.balance, { decimals: 0 })}
          </Label>
        </View>
      </View>
    </Card>
  );
}
