import { NavigatorScreenParams } from "@react-navigation/native";

// Parámetros de las pestañas inferiores (Wallet + IA)
export type BottomTabParamList = {
  Home: undefined;
  Transactions: undefined;
  AIAdvisor: undefined;
  Budgets: undefined;
  Profile: undefined;
};

// Parámetros del panel lateral (Drawer)
export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  Accounts: undefined;
  Security: undefined;
  Settings: undefined;
};

// Parámetros de la raíz (Auth vs App)
export type RootStackParamList = {
  Login: undefined;
  Onboarding: undefined;
  MainApp: NavigatorScreenParams<DrawerParamList>;
};
