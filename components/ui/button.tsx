import { useThemeColors } from "@/hooks/use-theme-colors";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize = "sm" | "default" | "lg" | "icon";

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  /**
   * Removes all default variant/size styles — use className to build from scratch.
   */
  unstyled?: boolean;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const containerVariantClass: Record<ButtonVariant, string> = {
  default: "bg-primary",
  destructive: "bg-destructive",
  outline: "bg-transparent border border-border",
  secondary: "bg-secondary",
  ghost: "bg-transparent",
  link: "bg-transparent",
};

const textVariantClass: Record<ButtonVariant, string> = {
  default: "text-primary-foreground",
  destructive: "text-destructive-foreground",
  outline: "text-foreground",
  secondary: "text-secondary-foreground",
  ghost: "text-foreground",
  link: "text-primary",
};

const containerSizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-4 rounded-sm gap-1.5",
  default: "h-11 px-6 rounded-sm gap-2",
  lg: "h-14 px-8 rounded-md gap-2",
  icon: "h-11 w-11 rounded-sm",
};

const textSizeClass: Record<ButtonSize, string> = {
  sm: "text-sm",
  default: "text-sm",
  lg: "text-base",
  icon: "text-sm",
};

// ─── Loading indicator color per variant ──────────────────────────────────────

function useLoadingColor(variant: ButtonVariant) {
  const colors = useThemeColors();
  const map: Record<ButtonVariant, string> = {
    default: colors.primaryForeground,
    destructive: colors.destructiveForeground,
    outline: colors.foreground,
    secondary: colors.secondaryForeground,
    ghost: colors.foreground,
    link: colors.primary,
  };
  return map[variant];
}

// ─── Button ───────────────────────────────────────────────────────────────────

export function Button({
  children,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  onPress,
  className = "",
  style,
  activeOpacity = 0.8,
  unstyled = false,
}: ButtonProps) {
  const loadingColor = useLoadingColor(variant);

  const computedClassName = unstyled
    ? className
    : [
        "flex-row items-center justify-center",
        containerVariantClass[variant],
        containerSizeClass[size],
        disabled || loading ? "opacity-50" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ");

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
      className={computedClassName}
      style={style}
    >
      {!unstyled && loading && (
        <ActivityIndicator size="small" color={loadingColor} />
      )}
      {typeof children === "string" ? (
        <Text
          className={`font-inter-semibold ${textVariantClass[variant]} ${textSizeClass[size]}`}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
