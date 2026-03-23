import React from "react";
import { Text, View } from "react-native";

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
  email: string;
}

export function ProfileAvatar({ firstName, lastName, email }: ProfileAvatarProps) {
  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((s) => s[0].toUpperCase())
      .join("") || email[0]?.toUpperCase() || "?";

  return (
    <View className="items-center pt-6 pb-8">
      <View
        className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Text className="text-2xl font-manrope-bold text-primary-foreground">
          {initials}
        </Text>
      </View>
      {email ? (
        <Text className="text-sm font-inter text-muted-foreground">{email}</Text>
      ) : null}
    </View>
  );
}
