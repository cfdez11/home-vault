import { useAuth } from "@/src/features/auth/context/auth-context";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AuthCallbackScreen() {
  const { session, loading } = useAuth();

  if (!loading && session) return <Redirect href="/(tabs)" />;

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator />
    </View>
  );
}
