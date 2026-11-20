import { useTheme } from "../hooks/useTheme";

/** Agrega transparencia a un color #RRGGBB. Si el formato es otro, lo devuelve igual. */
export function withAlpha(color: string, alpha: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(color)) return color;
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${color}${a}`;
}

/**
 * Colores semánticos (éxito / alerta / peligro). Si tu tema ya define
 * `colors.success` o `colors.warning` se usan; si no, hay valores por defecto.
 */
export function useStatusColors() {
  const { theme } = useTheme();
  const c = theme.colors as unknown as Record<string, string>;
  return {
    success: c.success ?? "#16A34A",
    warning: c.warning ?? "#D97706",
    danger: c.error ?? "#DC2626",
    primary: c.primary,
  };
}
