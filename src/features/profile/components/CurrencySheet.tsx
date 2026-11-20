import React from "react";

import { BottomSheet, OptionCard } from "../../../components/ui";
import { CURRENCIES } from "../../../core/utils/Format";
import { useFinance } from "../../../core/hooks/useFinance";

export function CurrencySheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { preferences, setPreferences } = useFinance();
  return (
    <BottomSheet
      visible={visible}
      title="Moneda predeterminada"
      onClose={onClose}
    >
      {CURRENCIES.map((c) => (
        <OptionCard
          key={c.code}
          title={c.code}
          description={c.label}
          selected={preferences.currency === c.code}
          onPress={() => {
            setPreferences({ currency: c.code });
            onClose();
          }}
        />
      ))}
    </BottomSheet>
  );
}
