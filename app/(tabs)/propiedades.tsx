import { AppHeader } from "@/components/app-header";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PropertiesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#f7f9fb]">
      <AppHeader title="Propiedades" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-sm text-[#444651] mt-2">Próximamente</Text>
      </View>
    </SafeAreaView>
  );
}
