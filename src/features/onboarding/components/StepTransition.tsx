import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface Props {
  /** Cambia cada vez que el usuario avanza o retrocede de paso. */
  stepKey: number;
  children: React.ReactNode;
}

/** Transición breve al cambiar de paso (responde a la acción del usuario). */
export function StepTransition({ stepKey, children }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(10);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [stepKey, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}
