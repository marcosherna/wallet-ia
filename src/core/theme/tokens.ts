import { StyleSheet } from "react-native";

export const lightColors = {
  background: "#FFFFFF",
  surface: "#F4F5F7",
  text: "#0F172A",
  textSecondary: "#64748B",
  primary: "#0066FF",
  primaryForeground: "#FFFFFF",
  border: "#E2E8F0",
  card: "#FFFFFF",
  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  aiBubble: "#F1F5F9",
  aiText: "#0F172A",
  overlay: "rgba(15, 23, 42, 0.4)",
} as const;

export const darkColors = {
  background: "#0F172A",
  surface: "#1E293B",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  primary: "#3B82F6",
  primaryForeground: "#FFFFFF",
  border: "#334155",
  card: "#1E293B",
  error: "#F87171",
  success: "#34D399",
  warning: "#FBBF24",
  aiBubble: "#334155",
  aiText: "#F8FAFC",
  overlay: "rgba(0, 0, 0, 0.6)",
} as const;

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 20,
  full: 9999,
} as const;

export const typography = {
  fonts: {
    regular: "System",
    medium: "System",
    bold: "System",
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    heading: 32,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 28,
    xxl: 32,
    heading: 40,
  },
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const shadows = {
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
} as const;

export const lightTheme = {
  colors: lightColors,
  spacing,
  radii,
  typography,
  shadows,
  isDark: false,
};

export const darkTheme = {
  colors: darkColors,
  spacing,
  radii,
  typography,
  shadows,
  isDark: true,
};

export type Theme = {
  colors: { [K in keyof typeof lightColors]: string };
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  shadows: typeof shadows;
  isDark: boolean;
};
export type ColorKeys = keyof typeof lightColors;
export type SpacingKeys = keyof typeof spacing;
export type RadiiKeys = keyof typeof radii;
