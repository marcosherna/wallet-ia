import React from "react";
import { View } from "react-native";

import { GOAL_OPTIONS, PrimaryGoal } from "../onboarding.data";
import { StepHeader } from "./StepHeader";
import { OptionCard } from "../../../components/ui/OptionCard";

interface Props {
  value: PrimaryGoal | "";
  onChange: (value: PrimaryGoal) => void;
}

export function GoalStep({ value, onChange }: Props) {
  return (
    <View accessibilityRole="radiogroup">
      <StepHeader
        title="¿Cuál es tu objetivo principal?"
        subtitle="Adaptaremos los consejos de IA a lo que quieres lograr."
      />
      {GOAL_OPTIONS.map((option) => (
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
