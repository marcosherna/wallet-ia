import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RootStackParamList } from "../../../navigations/types";
import { useTheme } from "../../../core/hooks/useTheme";
import { useStyles } from "../../../core/hooks/useStyles";
import { Button } from "../../../components/ui";
import { FinancialProfile, TOTAL_STEPS } from "../onboarding.data";
import { useAuth } from "../../../core/hooks/useAuth";
import { useFinance } from "../../../core/hooks/useFinance";

import {
  JobStep,
  IncomeStep,
  GoalStep,
  ProgressHeader,
  StepTransition,
} from "../components";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export default function OnboardingScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuth();
  const { addGoal, accounts } = useFinance();

  const styles = useStyles((theme) => ({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    scroll: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
  }));

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<FinancialProfile>({
    jobStatus: "",
    monthlyIncome: "",
    primaryGoal: "",
  });

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  const isStepValid = (() => {
    switch (currentStep) {
      case 0:
        return profile.jobStatus !== "";
      case 1:
        return Number(profile.monthlyIncome) > 0;
      case 2:
        return profile.primaryGoal !== "";
      default:
        return false;
    }
  })();

  const handleNext = async () => {
    if (!isStepValid) return;

    if (!isLastStep) {
      setCurrentStep((step) => step + 1);
      return;
    }

    setLoading(true);
    try {
      // 1. Guardar perfil de onboarding en Supabase o almacén local
      await completeOnboarding(profile);

      // 2. Si el usuario definió una meta principal, sembramos una meta inicial coherente
      const income = Number(profile.monthlyIncome) || 2000;
      if (profile.primaryGoal === "emergency") {
        addGoal({
          name: "Fondo de emergencia",
          target: income * 3,
          saved: 0,
          deadline: "12 meses",
          icon: "emergency",
          monthlyContribution: Math.round(income * 0.15),
        });
      } else if (profile.primaryGoal === "invest") {
        addGoal({
          name: "Portafolio de Inversión",
          target: income * 5,
          saved: 0,
          deadline: "24 meses",
          icon: "target",
          monthlyContribution: Math.round(income * 0.2),
        });
      }

      // 3. Navegar a la app principal
      navigation.replace("MainApp", {
        screen: "MainTabs",
        params: { screen: "Home" },
      });
    } catch (err: any) {
      Alert.alert(
        "Aviso",
        "Se guardó la información localmente. Puedes continuar a tu panel.",
        [
          {
            text: "Continuar",
            onPress: () =>
              navigation.replace("MainApp", {
                screen: "MainTabs",
                params: { screen: "Home" },
              }),
          },
        ],
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((step) => Math.max(0, step - 1));
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[styles.header, { paddingTop: insets.top + theme.spacing.sm }]}
      >
        <ProgressHeader
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onBack={handleBack}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepTransition stepKey={currentStep}>
          {currentStep === 0 && (
            <JobStep
              value={profile.jobStatus}
              onChange={(jobStatus) => setProfile((p) => ({ ...p, jobStatus }))}
            />
          )}
          {currentStep === 1 && (
            <IncomeStep
              value={profile.monthlyIncome}
              onChange={(monthlyIncome) =>
                setProfile((p) => ({ ...p, monthlyIncome }))
              }
            />
          )}
          {currentStep === 2 && (
            <GoalStep
              value={profile.primaryGoal}
              onChange={(primaryGoal) =>
                setProfile((p) => ({ ...p, primaryGoal }))
              }
            />
          )}
        </StepTransition>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, theme.spacing.md) },
        ]}
      >
        <Button
          title={isLastStep ? "Finalizar y empezar" : "Continuar"}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!isStepValid || loading}
          onPress={handleNext}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
