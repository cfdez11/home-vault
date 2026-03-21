import { useThemeColors } from "@/hooks/use-theme-colors";
import React from "react";
import { Text, View } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "destructive-subtle"
  | "success"
  | "success-subtle"
  | "accent"
  | "accent-subtle"
  | "muted"
  | "card"
  | "outline";

export type BadgeSize = "sm" | "default";

export interface BadgeProps {
  children: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  uppercase?: boolean;
  className?: string;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const containerVariantClass: Record<BadgeVariant, string> = {
  default: "bg-primary",
  secondary: "bg-secondary",
  destructive: "bg-destructive",
  "destructive-subtle": "bg-destructive-subtle",
  success: "bg-success",
  "success-subtle": "bg-success-subtle",
  accent: "bg-accent",
  "accent-subtle": "bg-accent-subtle",
  muted: "bg-muted",
  card: "bg-card",
  outline: "bg-transparent border border-border",
};

const textVariantClass: Record<BadgeVariant, string> = {
  default: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  destructive: "text-destructive-foreground",
  "destructive-subtle": "text-destructive",
  success: "text-success-foreground",
  "success-subtle": "text-success",
  accent: "text-accent-foreground",
  "accent-subtle": "text-accent",
  muted: "text-muted-foreground",
  card: "text-primary",
  outline: "text-foreground",
};

const containerSizeClass: Record<BadgeSize, string> = {
  sm: "px-2.5 py-1 gap-1",
  default: "px-3 py-1.5 gap-1.5",
};

const textSizeClass: Record<BadgeSize, string> = {
  sm: "text-[10px]",
  default: "text-[13px]",
};

const iconSizeMap: Record<BadgeSize, number> = {
  sm: 10,
  default: 13,
};

// ─── Icon color per variant ───────────────────────────────────────────────────

function useIconColor(variant: BadgeVariant): string {
  const c = useThemeColors();
  const map: Record<BadgeVariant, string> = {
    default: c.primaryForeground,
    secondary: c.secondaryForeground,
    destructive: c.destructiveForeground,
    "destructive-subtle": c.destructive,
    success: c.successForeground,
    "success-subtle": c.success,
    accent: c.accentForeground,
    "accent-subtle": c.accent,
    muted: c.mutedForeground,
    card: c.primary,
    outline: c.foreground,
  };
  return map[variant];
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export function Badge({
  children,
  variant = "default",
  size = "default",
  icon: Icon,
  uppercase = false,
  className = "",
}: BadgeProps) {
  const iconColor = useIconColor(variant);

  return (
    <View
      className={[
        "flex-row items-center rounded-full",
        containerVariantClass[variant],
        containerSizeClass[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {Icon && <Icon size={iconSizeMap[size]} color={iconColor} />}
      <Text
        className={[
          "font-inter-semibold",
          textVariantClass[variant],
          textSizeClass[size],
          uppercase ? "tracking-wider uppercase" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </Text>
    </View>
  );
}
