import React from "react";
import { Alert, View } from "react-native";
import { CheckCircle2 } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import {
  BottomSheet,
  Button,
  Card,
  Divider,
  Label,
} from "../../../components/ui";
import { Loan } from "../../../core/types/Finance";
import { loanStatus } from "../../../core/utils/Finance";
import { formatLongDate } from "../../../core/utils/Format";
import { useFinance } from "../../../core/hooks/useFinance";

interface Props {
  loan: Loan | null;
  onClose: () => void;
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Label size="sm" color={theme.colors.textSecondary}>
        {label}
      </Label>
      <Label size="sm" weight={bold ? "bold" : "medium"}>
        {value}
      </Label>
    </View>
  );
}

/** Estado de cuenta del crédito: cuotas, capital vs intereses y saldo insoluto. */
export function LoanDetailSheet({ loan, onClose }: Props) {
  const { theme } = useTheme();
  const { money, payInstallment } = useFinance();

  if (!loan)
    return (
      <BottomSheet visible={false} title="" onClose={onClose}>
        {null}
      </BottomSheet>
    );

  const s = loanStatus(loan);
  const paidTotal = s.principalPaid + s.interestPaid;
  const capitalShare = paidTotal > 0 ? s.principalPaid / paidTotal : 0;
  const finished = s.remaining <= 0;

  const confirmPay = () =>
    Alert.alert(
      "Registrar pago",
      `¿Registrar el pago de la cuota ${loan.paidInstallments + 1} por ${money(loan.monthlyPayment)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Registrar", onPress: () => payInstallment(loan.id) },
      ],
    );

  return (
    <BottomSheet visible title={loan.name} onClose={onClose}>
      <Card variant="muted" style={{ gap: 2 }}>
        <Label size="sm" color={theme.colors.textSecondary}>
          Saldo insoluto
        </Label>
        <Label size="xl" weight="bold" style={{ fontSize: 30, lineHeight: 36 }}>
          {money(s.balance)}
        </Label>
        <Label size="xs" color={theme.colors.textSecondary}>
          Faltan {s.remaining} cuotas de {money(loan.monthlyPayment)}
        </Label>
      </Card>

      <View style={{ gap: theme.spacing.sm }}>
        <Label size="sm" weight="semibold">
          Lo que has pagado hasta hoy
        </Label>
        <View
          style={{
            flexDirection: "row",
            height: 10,
            borderRadius: theme.radii.full,
            overflow: "hidden",
            backgroundColor: theme.colors.border,
          }}
        >
          <View
            style={{
              flex: capitalShare,
              backgroundColor: theme.colors.primary,
            }}
          />
          <View
            style={{
              flex: 1 - capitalShare,
              backgroundColor: theme.colors.textSecondary,
              opacity: 0.5,
            }}
          />
        </View>
        <Row label="Capital amortizado" value={money(s.principalPaid)} />
        <Row label="Intereses pagados" value={money(s.interestPaid)} />
      </View>

      <Divider />
      <Row label="Monto del crédito" value={money(loan.principal)} />
      <Row label="Tasa anual (APR)" value={`${loan.apr}%`} />
      <Row label="Plazo" value={`${loan.termMonths} meses`} />
      <Row
        label="Cuotas pagadas"
        value={`${loan.paidInstallments} de ${loan.termMonths}`}
      />
      <Row label="Intereses totales estimados" value={money(s.totalInterest)} />
      {!finished && (
        <Row
          label="Próximo pago"
          value={formatLongDate(s.nextPayment.toISOString())}
          bold
        />
      )}

      {finished ? (
        <Label size="sm" weight="semibold" align="center">
          Crédito liquidado
        </Label>
      ) : (
        <Button
          title="Registrar pago de cuota"
          size="lg"
          fullWidth
          leftIcon={CheckCircle2}
          onPress={confirmPay}
        />
      )}
    </BottomSheet>
  );
}
