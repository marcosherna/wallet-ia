import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Alert,
} from "react-native";
import { Trash2 } from "lucide-react-native";

import { useTheme } from "../../../core/hooks/useTheme";
import { Button, ScreenContainer, SegmentedControl } from "../../../components/ui";

import {
  ChatBubble,
  ChatInput,
  ScenarioSimulator,
  SuggestedPrompts,
  TypingIndicator,
} from "../components";
import { useFinance } from "../../../core/hooks/useFinance";
import { useAuth } from "../../../core/hooks/useAuth";
import { databaseService } from "../../../services/databaseService";
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
  const { user } = useAuth();
  const userId = user?.id || "demo-user";

  const [tab, setTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  // Cargar historial de chat persistido desde Supabase o almacenamiento local
  useEffect(() => {
    databaseService.loadChatMessages(userId).then((history) => {
      if (history && history.length > 0) {
        setMessages([WELCOME, ...history]);
      }
    });
  }, [userId]);

  const send = async (text: string) => {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((m) => [...m, userMsg]);
    databaseService.saveChatMessage(userId, userMsg);

    setThinking(true);
    try {
      const answer = await askAdvisor(text, finance);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: answer,
      };
      setMessages((m) => [...m, assistantMsg]);
      databaseService.saveChatMessage(userId, assistantMsg);
    } catch {
      const errorMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        role: "assistant",
        text: "No pude completar el análisis. Inténtalo de nuevo en un momento.",
      };
      setMessages((m) => [...m, errorMsg]);
    } finally {
      setThinking(false);
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      "Limpiar conversación",
      "¿Deseas borrar el historial de mensajes de este chat?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: () => {
            databaseService.clearChatMessages(userId);
            setMessages([WELCOME]);
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer
      title="Asesor IA"
      subtitle="Análisis con tus datos reales"
      scroll={false}
      headerRight={
        tab === "chat" && messages.length > 1 ? (
          <Button
            title=""
            size="sm"
            variant="ghost"
            leftIcon={Trash2}
            onPress={handleClearChat}
          />
        ) : undefined
      }
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
