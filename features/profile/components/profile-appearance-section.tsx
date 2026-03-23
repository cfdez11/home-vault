import { SegmentedControl } from "@/components/ui/segmented-control";
import { ScreenSection } from "@/components/ui/screen";
import {
  useThemePreference,
  type ThemePreference,
} from "@/lib/theme-preference-context";
import { Monitor, Moon, Sun } from "lucide-react-native";
import React from "react";

const THEME_OPTIONS = [
  { value: "light" as ThemePreference, label: "Claro", icon: Sun },
  { value: "dark" as ThemePreference, label: "Oscuro", icon: Moon },
  { value: "system" as ThemePreference, label: "Sistema", icon: Monitor },
];

export function ProfileAppearanceSection() {
  const { preference, setPreference } = useThemePreference();

  return (
    <ScreenSection title="Apariencia">
      <SegmentedControl
        options={THEME_OPTIONS}
        value={preference}
        onValueChange={setPreference}
      />
    </ScreenSection>
  );
}
