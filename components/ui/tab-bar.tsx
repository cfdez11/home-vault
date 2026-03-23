import { cn } from "@/lib/utils";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabItem {
  key: string;
  label: string;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  /** Horizontal padding applied to the scroll content (default: 20) */
  horizontalPadding?: number;
  className?: string;
}

// ─── TabBar ───────────────────────────────────────────────────────────────────

export function TabBar({
  tabs,
  activeKey,
  onChange,
  horizontalPadding = 20,
  className,
}: TabBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: horizontalPadding, gap: 8 }}
      className={className}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.7}
            className={cn(
              "flex-row items-center gap-1.5 rounded-full py-2 px-5",
              isActive ? "bg-primary" : "bg-muted"
            )}
          >
            <Text
              className={cn(
                "text-[13px] font-inter-semibold",
                isActive ? "text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
