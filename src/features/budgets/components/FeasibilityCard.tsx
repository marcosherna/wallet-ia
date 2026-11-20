import React from "react";
import { View } from "react-native";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Card, IconBadge, Label } from "../../../components/ui";
import { GoalEvaluation } from "../../../core/utils/Finance";
import { IconComponent, Tone } from "../../../components/ui/types";
import { useFinance } from "../../../core/hooks/useFinance";

const META: Record<
  GoalEvaluation["verdict"],
  { icon: IconComponent; tone: Tone; title: string }
> = {
  viable: { icon: CheckCircle2, tone: "success", title: "Viable" },
  viable_adjusting: {
    icon: CheckCircle2,
    tone: "success",
    title: "Viable con ajustes",
  },
  risky: { icon: AlertTriangle, tone: "warning", title: "Riesgoso" },
  impossible: {
    icon: XCircle,
    tone: "danger",
    title: "Imposible con tu flujo actual",
  },
};

/** Veredicto del simulador de metas. */
export function FeasibilityCard({ result }: { result: GoalEvaluation }) {
  const { theme } = useTheme();
  const { money } = useFinance();
  const { icon, tone, title } = META[result.verdict];

  const detail = (() => {
    switch (result.verdict) {
      case "viable":
        return "Tu flujo mensual cubre la cuota con margen.";
      case "viable_adjusting":
        return `Necesitas recortar unos ${money(result.adjustment, { decimals: 0 })} al mes en ocio para lograrlo.`;
      case "risky":
        return "Casi todo tu dinero libre iría a esta meta. Un imprevisto podría desviarte.";
      default:
        return `Con tu dinero libre actual, un plazo realista sería de unos ${result.suggestedMonths} meses.`;
    }
  })();

  return (
    <Card
      variant="muted"
      style={{
        flexDirection: "row",
        gap: theme.spacing.md,
        alignItems: "flex-start",
      }}
    >
      <IconBadge icon={icon} tone={tone} />
      <View style={{ flex: 1, gap: 2 }}>
        <Label size="md" weight="bold">
          {title}
        </Label>
        <Label size="sm" weight="semibold">
          Cuota mensual requerida: {money(result.requiredMonthly)}
        </Label>
        <Label size="sm" color={theme.colors.textSecondary} paragraph>
          {detail}
        </Label>
      </View>
    </Card>
  );
}
