import { useMemo } from "react";
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";
import { useTheme } from "./useTheme";
import { Theme } from "../theme/tokens";

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

type StyleFactory<T extends NamedStyles<T> | NamedStyles<any>> = (
  theme: Theme,
) => T;

export const useStyles = <T extends NamedStyles<T> | NamedStyles<any>>(
  factory: StyleFactory<T>,
): T => {
  const { theme } = useTheme();
  return useMemo(() => StyleSheet.create(factory(theme)), [theme, factory]);
};
