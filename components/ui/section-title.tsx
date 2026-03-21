import { Text } from "react-native";

interface SectionTitleProps {
  children: string;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <Text className="text-lg font-manrope-bold text-primary">{children}</Text>
  );
}
