import { ScreenSection } from "@/components/ui/screen";
import { Text } from "react-native";

interface WelcomeHeaderProps {
  name: string;
  subtitle: string;
}

export function WelcomeHeader({ name, subtitle }: WelcomeHeaderProps) {
  return (
    <ScreenSection>
      <Text className="text-3xl font-manrope-extrabold text-primary">
        Hola, {name}
      </Text>
      <Text className="text-lg text-muted-foreground">{subtitle}</Text>
    </ScreenSection>
  );
}
