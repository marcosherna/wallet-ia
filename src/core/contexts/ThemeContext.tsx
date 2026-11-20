import { createContext } from "react";
import { Theme } from "../theme/tokens";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
