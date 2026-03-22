import { cn } from "@/lib/utils";
import { View } from "react-native";

interface SeparatorProps {
  className?: string;
}

export function Separator({ className }: SeparatorProps) {
  return <View className={cn("h-px bg-border", className)} />;
}
