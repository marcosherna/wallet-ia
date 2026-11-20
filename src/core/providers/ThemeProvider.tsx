import React, { useState, useMemo } from "react";
import { useColorScheme } from "react-native";
import { ThemeContext, ThemeMode } from "../contexts/ThemeContext";
import { lightTheme, darkTheme } from "../theme/tokens";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  const activeColorScheme = useMemo(() => {
    if (mode === "system") return systemColorScheme ?? "light";
    return mode;
  }, [mode, systemColorScheme]);

  const theme = activeColorScheme === "dark" ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      theme,
      mode,
      isDark: theme.isDark,
      setMode,
      toggleTheme,
    }),
    [theme, mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
