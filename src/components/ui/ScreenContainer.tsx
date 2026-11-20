import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../core/hooks/useTheme";
import { Label } from "./Label";

interface ScreenContainerProps {
  title: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  /** false para pantallas con lista propia (chat, SectionList). */
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/** Contenedor estándar de las pestañas: encabezado + contenido con márgenes consistentes. */
export function ScreenContainer({
  title,
  subtitle,
  headerRight,
  scroll = true,
  refreshing = false,
  onRefresh,
  contentStyle,
  children,
}: ScreenContainerProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const header = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing.lg,
        paddingTop: insets.top + theme.spacing.md,
        paddingBottom: theme.spacing.md,
      }}
    >
      <View style={{ flex: 1 }}>
        <Label size="xl" weight="bold" heading>
          {title}
        </Label>
        {subtitle ? (
          <Label
            size="sm"
            color={theme.colors.textSecondary}
            style={{ marginTop: 2 }}
          >
            {subtitle}
          </Label>
        ) : null}
      </View>
      {headerRight}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {header}
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
              />
            ) : undefined
          }
          contentContainerStyle={[
            {
              paddingHorizontal: theme.spacing.lg,
              paddingBottom: theme.spacing.xl,
              gap: theme.spacing.lg,
            },
            contentStyle,
          ]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
      )}
    </View>
  );
}
