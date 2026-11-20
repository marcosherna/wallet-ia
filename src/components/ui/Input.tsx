import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
  Text,
  TouchableOpacity,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

import { useTheme } from "../../core/hooks/useTheme";
import { typography } from "../../core/theme/tokens";
import type { IconComponent } from "./types";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  /** Texto de apoyo bajo el campo (se oculta si hay error). */
  helperText?: string;
  /** Texto fijo al inicio del campo, p. ej. "$". */
  prefix?: string;
  /** Texto fijo al final del campo, p. ej. "USD". */
  suffix?: string;
  leftIcon?: IconComponent;

  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;

  labelSize?: keyof typeof typography.sizes;
  labelWeight?: keyof typeof typography.weights;
  inputSize?: keyof typeof typography.sizes;
  inputWeight?: keyof typeof typography.weights;
  errorSize?: keyof typeof typography.sizes;
  errorWeight?: keyof typeof typography.weights;

  showTogglePassword?: boolean;
}

export function Input({
  label = "",
  error = "",
  helperText = "",
  placeholder = "",
  value,
  onChangeText,
  multiline = false,
  keyboardType = "default",
  prefix,
  suffix,
  leftIcon: LeftIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,

  labelSize = "sm",
  labelWeight = "semibold",
  inputSize = "md",
  inputWeight = "regular",
  errorSize = "sm",
  errorWeight = "medium",

  secureTextEntry,
  showTogglePassword = false,
  onFocus,
  onBlur,

  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.error
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  // Los tipos de los eventos se autodenotan correctamente desde TextInputProps
  const handleFocus: NonNullable<TextInputProps["onFocus"]> = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur: NonNullable<TextInputProps["onBlur"]> = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const adornmentStyle = {
    fontSize: theme.typography.sizes[inputSize],
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text
          style={[
            {
              marginBottom: theme.spacing.xs,
              fontSize: theme.typography.sizes[labelSize],
              fontWeight: theme.typography.weights[labelWeight],
              color: theme.colors.text,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.field,
          {
            borderColor,
            borderWidth: focused ? 1.5 : 1,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.md,
            paddingHorizontal: theme.spacing.md,
          },
          multiline && styles.fieldMultiline,
        ]}
      >
        {LeftIcon ? (
          <View style={{ marginRight: theme.spacing.sm }}>
            <LeftIcon
              size={20}
              color={
                focused ? theme.colors.primary : theme.colors.textSecondary
              }
            />
          </View>
        ) : null}

        {prefix ? (
          <Text style={[adornmentStyle, { marginRight: theme.spacing.xs }]}>
            {prefix}
          </Text>
        ) : null}

        <TextInput
          accessibilityLabel={label || placeholder}
          style={[
            styles.input,
            {
              paddingVertical: theme.spacing.sm,
              fontSize: theme.typography.sizes[inputSize],
              fontWeight: theme.typography.weights[inputWeight],
              color: theme.colors.text,
            },
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          keyboardType={keyboardType}
          secureTextEntry={hidden}
          selectionColor={theme.colors.primary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {suffix ? (
          <Text style={[adornmentStyle, { marginLeft: theme.spacing.xs }]}>
            {suffix}
          </Text>
        ) : null}

        {showTogglePassword && (
          <TouchableOpacity
            onPress={() => setHidden(!hidden)}
            style={styles.eyeButton}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel={
              hidden ? "Mostrar contraseña" : "Ocultar contraseña"
            }
          >
            {hidden ? (
              <EyeOff size={20} color={theme.colors.textSecondary} />
            ) : (
              <Eye size={20} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[
            {
              marginTop: theme.spacing.xs,
              fontSize: theme.typography.sizes[errorSize],
              fontWeight: theme.typography.weights[errorWeight],
              color: theme.colors.error,
            },
            errorStyle,
          ]}
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text
          style={{
            marginTop: theme.spacing.xs,
            fontSize: theme.typography.sizes[errorSize],
            color: theme.colors.textSecondary,
          }}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
  },
  fieldMultiline: {
    alignItems: "flex-start",
    minHeight: 100,
  },
  input: {
    flex: 1,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },
});
