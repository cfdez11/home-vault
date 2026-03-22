import { cn } from "@/lib/utils";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "./button";

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export function Card({ children, onPress, className = "" }: CardProps) {
  if (onPress) {
    return (
      <Button
        unstyled
        onPress={onPress}
        activeOpacity={0.9}
        className={cn("rounded-lg", className)}
      >
        {children}
      </Button>
    );
  }

  return <View className={cn("rounded-lg", className)}>{children}</View>;
}

// ─── Card sub-components ──────────────────────────────────────────────────────

interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardSectionProps) {
  return <View className={cn("px-4 pt-4 pb-2", className)}>{children}</View>;
}

export function CardContent({ children, className }: CardSectionProps) {
  return <View className={cn("px-4 py-3", className)}>{children}</View>;
}

export function CardFooter({ children, className }: CardSectionProps) {
  return <View className={cn("px-4 pt-2 pb-4", className)}>{children}</View>;
}

export interface CardTitleProps extends React.ComponentProps<typeof Text> {
  className?: string;
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <Text
      className={cn("text-[18px] font-manrope-bold text-primary", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: CardTitleProps) {
  return (
    <Text
      className={cn("text-[13px] font-inter text-muted-foreground", className)}
      {...props}
    />
  );
}
