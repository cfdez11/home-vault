import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface AuthScreenProps {
  children: ReactNode;
  /** Use false for screens with many fields (register) so scroll is unrestricted */
  centered?: boolean;
}

/**
 * Base layout for all auth screens.
 * Handles SafeAreaView + KeyboardAvoidingView + ScrollView consistently.
 */
export function AuthScreen({ children, centered = true }: AuthScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: centered ? "center" : undefined,
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
