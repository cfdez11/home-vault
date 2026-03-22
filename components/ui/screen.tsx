import { cn } from "@/lib/utils";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SectionTitle } from "./section-title";

// ─── Screen ──────────────────────────────────────────────────────────────────

interface ScreenProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  fab?: React.ReactNode;
}

export function Screen({ children, header, fab }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {header}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
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
