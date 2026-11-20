import React, { useEffect, useRef } from "react";
import { Alert, StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@expo/ui/community/bottom-sheet";
import { CheckCircle2, Trash2 } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Button, Card, Divider, Label } from "../../../components/ui";
import { Loan } from "../../../core/types/Finance";
import { loanStatus } from "../../../core/utils/Finance";
import { formatLongDate } from "../../../core/utils/Format";
import { useFinance } from "../../../core/hooks/useFinance";
import { useStatusColors } from "../../../core/theme/Status";

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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { theme } = useTheme();
  const { danger } = useStatusColors();
  const { money, payInstallment, deleteLoan } = useFinance();

  useEffect(() => {
    if (loan) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [loan]);

  const s = loan ? loanStatus(loan) : null;
  const paidTotal = s ? s.principalPaid + s.interestPaid : 0;
  const capitalShare = paidTotal > 0 && s ? s.principalPaid / paidTotal : 0;
  const finished = s ? s.remaining <= 0 : false;

  const confirmPay = () => {
    if (!loan) return;
    Alert.alert(
      "Registrar pago",
      `¿Registrar el pago de la cuota ${loan.paidInstallments + 1} por ${money(loan.monthlyPayment)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Registrar", onPress: () => payInstallment(loan.id) },
      ],
    );
  };

  const confirmDelete = () => {
    if (!loan) return;
    Alert.alert(
      "Eliminar crédito",
      `¿Deseas eliminar el crédito "${loan.name}" del registro?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteLoan(loan.id);
            onClose();
          },
        },
      ],
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={loan ? 0 : -1}
      enablePanDownToClose
      onClose={onClose}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
            gap: theme.spacing.md,
          },
        ]}
      >
        {loan && s ? (
          <>
            <Label size="lg" weight="semibold" style={styles.title}>
              {loan.name}
            </Label>

            <Card variant="muted" style={{ gap: 2 }}>
              <Label size="sm" color={theme.colors.textSecondary}>
                Saldo insoluto
              </Label>
              <Label
                size="xl"
                weight="bold"
                style={{ fontSize: 30, lineHeight: 36 }}
              >
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
            <Row
              label="Intereses totales estimados"
              value={money(s.totalInterest)}
            />
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

            <Button
              title="Eliminar crédito"
              variant="ghost"
              leftIcon={Trash2}
              textStyle={{ color: danger }}
              onPress={confirmDelete}
            />
          </>
        ) : null}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
  },
  title: {
    textAlign: "center",
  },
});
