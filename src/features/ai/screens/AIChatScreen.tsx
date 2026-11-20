import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { ScreenContainer, SegmentedControl } from "../../../components/ui";

import {
  ChatBubble,
  ChatInput,
  ScenarioSimulator,
  SuggestedPrompts,
  TypingIndicator,
} from "../components";
import { useFinance } from "../../../core/hooks/useFinance";
import { askAdvisor, ChatMessage } from "../aiService";

type Tab = "chat" | "scenarios";

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hola, soy tu asesor financiero. Conozco tus saldos, ingresos y metas, así que puedo responder con tus datos reales. ¿Qué quieres revisar?",
};

export default function AIChatScreen() {
  const { theme } = useTheme();
  const finance = useFinance();

  const [tab, setTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const send = async (text: string) => {
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text }]);
    setThinking(true);
    try {
      const answer = await askAdvisor(text, finance);
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", text: answer },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: "No pude completar el análisis. Inténtalo de nuevo en un momento.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <ScreenContainer
      title="Asesor IA"
      subtitle="Análisis con tus datos reales"
      scroll={false}
    >
      <View
        style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
        }}
      >
        <SegmentedControl
          options={[
            { id: "chat" as Tab, label: "Asesor" },
            { id: "scenarios" as Tab, label: "Escenarios" },
          ]}
          value={tab}
          onChange={setTab}
        />
      </View>

      {tab === "chat" ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => <ChatBubble message={item} />}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.lg,
              paddingBottom: theme.spacing.md,
              gap: theme.spacing.md,
            }}
            ListFooterComponent={
              <View style={{ gap: theme.spacing.md }}>
                {thinking && <TypingIndicator />}
                {messages.length === 1 && !thinking && (
                  <SuggestedPrompts onSelect={send} />
                )}
              </View>
            }
          />
          <View
            style={{ padding: theme.spacing.lg, paddingTop: theme.spacing.sm }}
          >
            <ChatInput onSend={send} disabled={thinking} />
          </View>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
          }}
        >
          <ScenarioSimulator />
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
