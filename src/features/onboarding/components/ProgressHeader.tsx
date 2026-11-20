import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, View, StyleSheet } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "../../../core/hooks/useTheme";
import { Label } from "../../../components/ui";

interface Props {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

function Segment({ active }: { active: boolean }) {
  const { theme } = useTheme();
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [active, progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        styles.segment,
        {
          borderRadius: theme.radii.full,
          backgroundColor: theme.colors.border,
        },
      ]}
    >
      <Animated.View
        style={{ height: "100%", width, backgroundColor: theme.colors.primary }}
      />
    </View>
  );
}

export function ProgressHeader({ currentStep, totalSteps, onBack }: Props) {
  const { theme } = useTheme();
  const canGoBack = currentStep > 0;

  return (
    <View>
      <View style={styles.row}>
        <Pressable
          onPress={onBack}
          disabled={!canGoBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Volver al paso anterior"
          style={[styles.backButton, { opacity: canGoBack ? 1 : 0 }]}
        >
          <ChevronLeft size={24} color={theme.colors.text} />
        </Pressable>

        <Label size="sm" weight="medium" color={theme.colors.textSecondary}>
          Paso {currentStep + 1} de {totalSteps}
        </Label>

        {/* Espaciador para mantener el texto centrado */}
        <View style={styles.backButton} />
      </View>

      <View
        style={[
          styles.segments,
          { gap: theme.spacing.xs, marginTop: theme.spacing.md },
        ]}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: totalSteps, now: currentStep + 1 }}
      >
        {Array.from({ length: totalSteps }).map((_, index) => (
          <Segment key={index} active={index <= currentStep} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: -8,
    alignItems: "center",
    justifyContent: "center",
  },
  segments: {
    flexDirection: "row",
  },
  segment: {
    flex: 1,
    height: 4,
    overflow: "hidden",
  },
});
