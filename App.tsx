import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import RootNavigator from "./src/navigations/RootNavigator";

import { ThemeProvider } from "./src/core/providers/ThemeProvider";
import { FinanceProvider } from "./src/core/providers/FinanceProvider";

export default function App() {
  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
        <ThemeProvider>
          <SafeAreaProvider>
            <FinanceProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </FinanceProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});
