import { ScreenSection } from "@/components/ui/screen";
import { Text } from "react-native";

export interface ScreenTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  titleClassName?: string;
}

export function ScreenTitle({
  title,
  subtitle,
  action,
  titleClassName = "text-3xl font-manrope-extrabold text-primary",
}: ScreenTitleProps) {
  return (
    <ScreenSection>
      <Text className={titleClassName}>{title}</Text>
      {subtitle && (
        <Text className="text-[13px] font-inter text-muted-foreground leading-5 mt-1">
          {subtitle}
        </Text>
      )}
      {action}
    </ScreenSection>
  );
}
