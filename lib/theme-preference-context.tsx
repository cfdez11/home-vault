import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { createContext, useContext, useState } from "react";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "theme-preference";

interface ThemePreferenceContextValue {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  effectiveScheme: "light" | "dark";
}

const ThemePreferenceContext = createContext<ThemePreferenceContextValue>({
  preference: "system",
  setPreference: () => {},
  effectiveScheme: "light",
});

function getInitialPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {}
  return "system";
}

export function ThemePreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(
    getInitialPreference,
  );

  function setPreference(p: ThemePreference) {
    try {
      localStorage.setItem(STORAGE_KEY, p);
    } catch {}
    setPreferenceState(p);
  }

  const effectiveScheme: "light" | "dark" =
    preference === "system" ? (systemScheme ?? "light") : preference;

  return (
    <ThemePreferenceContext.Provider
      value={{ preference, setPreference, effectiveScheme }}
    >
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export const useThemePreference = () => useContext(ThemePreferenceContext);
