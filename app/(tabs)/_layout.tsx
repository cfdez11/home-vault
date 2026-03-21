import { Tabs } from "expo-router";
import React from "react";

import { CustomTabBar } from "@/components/custom-tab-bar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="propiedades" options={{ title: "Propiedades" }} />
      <Tabs.Screen name="empresas" options={{ title: "Empresas" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
