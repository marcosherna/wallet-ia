import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@expo/ui/community/bottom-sheet";

import { useTheme } from "../../../core/hooks/useTheme";
import { Label, OptionCard } from "../../../components/ui";
import { CURRENCIES } from "../../../core/utils/Format";
import { useFinance } from "../../../core/hooks/useFinance";
import type { CurrencyCode } from "../../../core/types/Finance";

export interface CurrencySheetProps {
  visible: boolean;
  onClose: () => void;
  current?: CurrencyCode;
  onSelect?: (currency: CurrencyCode) => void;
}

export function CurrencySheet({
  visible,
  onClose,
  current,
  onSelect,
}: CurrencySheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { theme } = useTheme();
  const { preferences, setPreferences } = useFinance();
  const activeCurrency = current ?? preferences.currency;

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      enablePanDownToClose
      onClose={onClose}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
            gap: theme.spacing.sm,
          },
        ]}
      >
        <Label size="lg" weight="semibold" style={styles.title}>
          Moneda predeterminada
        </Label>

        {CURRENCIES.map((c) => (
          <OptionCard
            key={c.code}
            title={c.code}
            description={c.label}
            selected={activeCurrency === c.code}
            onPress={() => {
              if (onSelect) {
                onSelect(c.code);
              } else {
                setPreferences({ currency: c.code });
              }
              onClose();
            }}
          />
        ))}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: 4,
  },
});
