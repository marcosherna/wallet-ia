import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Home,
  ArrowLeftRight,
  Sparkles,
  PieChart,
  User,
} from "lucide-react-native";

import { BottomTabParamList } from "./types";
import { useTheme } from "../core/hooks/useTheme";

import HomeScreen from "../features/home/screens/HomeScreen";
import TransactionsScreen from "../features/transactions/screens/TransactionsScreen";
import AIChatScreen from "../features/ai/screens/AIChatScreen";
import BudgetsScreen from "../features/budgets/screens/BudgetsScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // Colores dinámicos del tema para la barra de pestañas
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: theme.typography.fonts.medium,
          fontSize: theme.typography.sizes.xs,
          lineHeight: theme.typography.lineHeights.xs,
        },
        // Renderizado dinámico de iconos con Lucide React Native
        tabBarIcon: ({ color, size, focused }) => {
          const iconSize = 22;

          switch (route.name) {
            case "Home":
              return <Home size={iconSize} color={color} />;
            case "Transactions":
              return <ArrowLeftRight size={iconSize} color={color} />;
            case "AIAdvisor":
              return <Sparkles size={iconSize} color={color} />;
            case "Budgets":
              return <PieChart size={iconSize} color={color} />;
            case "Profile":
              return <User size={iconSize} color={color} />;
            default:
              return <Home size={iconSize} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Inicio" }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ title: "Movimientos" }}
      />
      <Tab.Screen
        name="AIAdvisor"
        component={AIChatScreen}
        options={{ title: "Asesor IA" }}
      />
      <Tab.Screen
        name="Budgets"
        component={BudgetsScreen}
        options={{ title: "Metas" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}
