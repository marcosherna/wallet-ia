import React from "react";
import { View } from "react-native";

import { JOB_OPTIONS, JobStatus } from "../onboarding.data";
import { StepHeader } from "./StepHeader";
import { OptionCard } from "../../../components/ui/OptionCard";

interface Props {
  value: JobStatus | "";
  onChange: (value: JobStatus) => void;
}

export function JobStep({ value, onChange }: Props) {
  return (
    <View accessibilityRole="radiogroup">
      <StepHeader
        title="¿Cuál es tu situación laboral?"
        subtitle="Con esto estimamos qué tan estables son tus ingresos."
      />
      {JOB_OPTIONS.map((option) => (
        <OptionCard
          key={option.id}
          title={option.title}
          description={option.description}
          icon={option.icon}
          selected={value === option.id}
          onPress={() => onChange(option.id)}
        />
      ))}
    </View>
  );
}
