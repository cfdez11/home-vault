import { useThemeColors } from '@/hooks/use-theme-colors';
import { cn } from '@/lib/utils';
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  rightLabel?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  icon: Icon,
  rightLabel,
  containerClassName,
  ...textInputProps
}: InputProps) {
  const colors = useThemeColors();

  return (
    <View className="gap-1.5">
      {(label || rightLabel) && (
        <View className="flex-row justify-between items-center">
          {label && (
            <Text className="text-[11px] font-inter-semibold text-primary uppercase tracking-widest">
              {label}
            </Text>
          )}
          {rightLabel}
        </View>
      )}

      <View
        className={cn(
          "flex-row items-center bg-muted rounded-sm px-4 h-[52px] gap-3",
          error && "border border-destructive",
          containerClassName
        )}
      >
        {Icon && <Icon size={18} color={error ? colors.destructive : colors.mutedForeground} />}
        <TextInput
          className="flex-1 text-[15px] font-inter text-foreground"
          placeholderTextColor={colors.mutedForeground}
          {...textInputProps}
        />
      </View>

      {error && (
        <Text className="text-[12px] font-inter text-destructive">{error}</Text>
      )}
    </View>
  );
}
