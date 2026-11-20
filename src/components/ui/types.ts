import type React from "react";

/** Cualquier componente de icono compatible con lucide-react-native. */
export type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
}>;

export type Tone = "primary" | "success" | "warning" | "danger" | "neutral";
