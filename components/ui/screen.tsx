import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SectionTitle } from "./section-title";

// ─── Screen ──────────────────────────────────────────────────────────────────

interface ScreenProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  fab?: React.ReactNode;
  keyboardAvoiding?: boolean;
  scrollViewRef?: React.RefObject<ScrollView | null>;
}

export function Screen({
  children,
  header,
  fab,
  keyboardAvoiding = false,
  scrollViewRef,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);

  const scrollView = (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
        {header}
      </View>
      <View className="flex-1">
        {keyboardAvoiding ? (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={insets.top + headerHeight}
          >
            {scrollView}
          </KeyboardAvoidingView>
        ) : (
          scrollView
        )}
        {fab}
      </View>
    </SafeAreaView>
  );
}

// ─── ScreenSection ────────────────────────────────────────────────────────────

interface ScreenSectionProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  /**
   * Whether to wrap children in a px-5 container.
   * Set to false for full-bleed content (cards with their own mx-5).
   * The title/action header always gets px-5 regardless.
   * @default true
   */
  padded?: boolean;
}

export function ScreenSection({
  className,
  children,
  title,
  action,
  padded = true,
}: ScreenSectionProps) {
  return (
    <View className={cn("mb-6", className)}>
      {(title || action) && (
        <View className="flex-row justify-between items-center px-5 mb-3">
          {title ? <SectionTitle>{title}</SectionTitle> : <View />}
          {action}
        </View>
      )}
      {children &&
        (padded ? <View className="px-5">{children}</View> : <>{children}</>)}
    </View>
  );
}
