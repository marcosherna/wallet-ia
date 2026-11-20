import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  LayoutDashboard,
  Wallet,
  ShieldCheck,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react-native";
import { View, StyleSheet } from "react-native";

import { DrawerParamList } from "./types";
import BottomTabNavigator from "./BottomTabNavigator";
import AccountsScreen from "../features/accounts/screens/AccountsScreen";
import SecurityScreen from "../features/settings/screens/SecurityScreen";
import SettingsScreen from "../features/home/screens/SettingsScreen";
import { useTheme } from "../core/hooks/useTheme";

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontFamily: theme.typography.fonts.bold,
          fontSize: theme.typography.sizes.lg,
          color: theme.colors.text,
        },
        drawerStyle: {
          backgroundColor: theme.colors.background,
          width: 280,
          borderRightColor: theme.colors.border,
          borderRightWidth: 1,
        },
        drawerActiveBackgroundColor: theme.colors.surface,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.textSecondary,
        drawerLabelStyle: {
          fontFamily: theme.typography.fonts.medium,
          fontSize: theme.typography.sizes.sm,
          marginLeft: -16,
        },
        drawerItemStyle: {
          borderRadius: theme.radii.sm,
          paddingHorizontal: theme.spacing.xs,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{
          title: "Panel Principal",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <LayoutDashboard size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          title: "Mis Cuentas y Tarjetas",
          drawerIcon: ({ color, size }) => <Wallet size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Security"
        component={SecurityScreen}
        options={{
          title: "Seguridad y Biometría",
          drawerIcon: ({ color, size }) => (
            <ShieldCheck size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Ajustes Generales",
          drawerIcon: ({ color, size }) => (
            <SettingsIcon size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
