import React from "react";
import { View } from "react-native";
import { Sparkles } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { IconBadge, Label } from "../../../components/ui";
import type { ChatMessage } from "../aiService";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const { theme } = useTheme();
  const mine = message.role === "user";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: theme.spacing.sm,
        alignSelf: mine ? "flex-end" : "flex-start",
        maxWidth: "88%",
      }}
    >
      {!mine && <IconBadge icon={Sparkles} size={30} />}
      <View
        style={{
          flexShrink: 1,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm + 2,
          borderRadius: theme.radii.md + 4,
          borderBottomRightRadius: mine ? 4 : theme.radii.md + 4,
          borderBottomLeftRadius: mine ? theme.radii.md + 4 : 4,
          backgroundColor: mine ? theme.colors.primary : theme.colors.card,
          borderWidth: mine ? 0 : 1,
          borderColor: theme.colors.border,
        }}
      >
        <Label
          size="md"
          paragraph
          color={mine ? theme.colors.primaryForeground : theme.colors.text}
          selectable
        >
          {message.text}
        </Label>
      </View>
    </View>
  );
}

export function TypingIndicator() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
      }}
    >
      <IconBadge icon={Sparkles} size={30} />
      <Label size="sm" color={theme.colors.textSecondary}>
        El asesor está analizando tus datos…
      </Label>
    </View>
  );
}
