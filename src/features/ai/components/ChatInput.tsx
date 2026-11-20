import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { SendHorizontal } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Input } from "../../../components/ui";

interface Props {
  disabled?: boolean;
  onSend: (text: string) => void;
}

export function ChatInput({ disabled, onSend }: Props) {
  const { theme } = useTheme();
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0 && !disabled;

  const send = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
      }}
    >
      <Input
        placeholder="Pregunta sobre tus finanzas"
        value={text}
        onChangeText={setText}
        onSubmitEditing={send}
        returnKeyType="send"
        containerStyle={{ flex: 1, marginVertical: 0 }}
      />
      <Pressable
        onPress={send}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Enviar mensaje"
        style={{
          width: 52,
          height: 52,
          borderRadius: theme.radii.md,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: canSend ? theme.colors.primary : theme.colors.border,
        }}
      >
        <SendHorizontal
          size={20}
          color={
            canSend
              ? theme.colors.primaryForeground
              : theme.colors.textSecondary
          }
        />
      </Pressable>
    </View>
  );
}
