import { Input } from "@/components/ui/input";
import { ScreenSection } from "@/components/ui/screen";
import React from "react";
import { View } from "react-native";

interface ProfileInfoSectionProps {
  firstName: string;
  lastName: string;
}

export function ProfileInfoSection({ firstName, lastName }: ProfileInfoSectionProps) {
  return (
    <ScreenSection title="Información personal">
      <View className="gap-4">
        <Input
          label="Nombre"
          value={firstName}
          editable={false}
          placeholder="—"
          containerClassName="opacity-60"
        />
        <Input
          label="Apellidos"
          value={lastName}
          editable={false}
          placeholder="—"
          containerClassName="opacity-60"
        />
      </View>
    </ScreenSection>
  );
}
