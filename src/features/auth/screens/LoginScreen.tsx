import React, { useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../navigations/types";
import { useTheme } from "../../../core/hooks/useTheme";
import { useStyles } from "../../../core/hooks/useStyles";
import { Button, Input, Label } from "../../../components/ui";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { theme } = useTheme();

  const styles = useStyles((theme) => ({
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      justifyContent: "center",
    },
    headerContainer: {
      marginBottom: theme.spacing.xl,
    },
    formContainer: {
      gap: theme.spacing.sm,
    },
    button: {
      marginTop: theme.spacing.md,
    },
  }));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace("Onboarding");
    }, 1000);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      bottomOffset={20}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Label size="heading" weight="bold">
            Bienvenido
          </Label>
          <Label
            size="md"
            weight="regular"
            color={theme.colors.textSecondary}
            paragraph
          >
            Inicia sesión para continuar
          </Label>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showTogglePassword
          />

          <Button
            title="Ingresar"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            style={styles.button}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
