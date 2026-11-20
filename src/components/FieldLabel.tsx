import React from "react";
import { Label } from "./ui";

/** Etiqueta de grupo de campos (para chips y selectores). */
export function FieldLabel({ children }: { children: string }) {
  return (
    <Label size="sm" weight="semibold" style={{ marginBottom: 6 }}>
      {children}
    </Label>
  );
}
