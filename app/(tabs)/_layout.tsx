import { CustomTabBar } from "@/components/custom-tab-bar";
import { useAuth } from "@/features/auth/context/auth-context";
import { Redirect, Tabs } from "expo-router";

export default function TabLayout() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return <Redirect href="/auth/login" />;

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="properties" options={{ title: "Properties" }} />
      <Tabs.Screen name="companies" options={{ title: "Companies" }} />
      <Tabs.Screen name="incidents" options={{ title: "Incidents" }} />
      <Tabs.Screen name="profile" options={{ href: null, title: "Profile" }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
