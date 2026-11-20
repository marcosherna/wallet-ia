import React from "react";
import { View } from "react-native";

import { useTheme } from "../../core/hooks/useTheme";

export function Divider() {
  const { theme } = useTheme();
  return <View style={{ height: 1, backgroundColor: theme.colors.border }} />;
}
