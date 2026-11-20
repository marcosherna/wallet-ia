import React, { useState } from "react";
import { View } from "react-native";
import { Landmark, LogOut } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import {
  Button,
  Card,
  EmptyState,
  ScreenContainer,
  SectionHeader,
} from "../../../components/ui";

import {
  AccountFormSheet,
  AccountList,
  LoanCard,
  LoanDetailSheet,
  LoanFormSheet,
  PreferencesSection,
  ProfileHeader,
} from "../components";

import { useStatusColors } from "../../../core/theme/Status";
import { useFinance } from "../../../core/hooks/useFinance";
import { Loan } from "../../../core/types/Finance";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { danger } = useStatusColors();
  const { loans } = useFinance();

  const [accountFormOpen, setAccountFormOpen] = useState(false);
  const [loanFormOpen, setLoanFormOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  // Se busca por id para que el detalle se actualice al registrar un pago.
  const selectedLoan: Loan | null =
    loans.find((l) => l.id === selectedLoanId) ?? null;

  return (
    <ScreenContainer title="Perfil" subtitle="Cuentas, créditos y preferencias">
      {/* TODO: reemplazar por los datos reales del usuario autenticado */}
      <ProfileHeader name="Mi perfil" email="usuario@correo.com" />

      <View style={{ gap: theme.spacing.md }}>
        <SectionHeader title="Cuentas y tarjetas" />
        <AccountList onAdd={() => setAccountFormOpen(true)} />
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <SectionHeader
          title="Créditos y préstamos"
          actionLabel="Registrar"
          onAction={() => setLoanFormOpen(true)}
        />
        {loans.length === 0 ? (
          <Card>
            <EmptyState
              icon={Landmark}
              title="Sin créditos activos"
              description="Registra un préstamo para ver cuántas cuotas faltan y cuánto capital has amortizado."
              actionLabel="Registrar crédito"
              onAction={() => setLoanFormOpen(true)}
            />
          </Card>
        ) : (
          loans.map((l) => (
            <LoanCard
              key={l.id}
              loan={l}
              onPress={(x) => setSelectedLoanId(x.id)}
            />
          ))
        )}
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <SectionHeader title="Preferencias" />
        <PreferencesSection />
      </View>

      <Button
        title="Cerrar sesión"
        variant="ghost"
        leftIcon={LogOut}
        textStyle={{ color: danger }}
        onPress={() => {
          /* TODO: cerrar sesión y navegar al flujo de autenticación */
        }}
      />

      <AccountFormSheet
        visible={accountFormOpen}
        onClose={() => setAccountFormOpen(false)}
      />
      <LoanFormSheet
        visible={loanFormOpen}
        onClose={() => setLoanFormOpen(false)}
      />
      <LoanDetailSheet
        loan={selectedLoan}
        onClose={() => setSelectedLoanId(null)}
      />
    </ScreenContainer>
  );
}
