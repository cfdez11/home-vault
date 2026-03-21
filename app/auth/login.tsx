import { useAuth } from "@/features/auth/context/auth-context";
import LoginScreen from "@/features/auth/screens/login-screen";
import { Redirect } from "expo-router";

export default function LoginRoute() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (session) return <Redirect href="/(tabs)" />;

  return <LoginScreen />;
}
