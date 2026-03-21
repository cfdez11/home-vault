import { useAuth } from "@/features/auth/context/auth-context";
import RegisterScreen from "@/features/auth/screens/register-screen";
import { Redirect } from "expo-router";

export default function RegisterRoute() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (session) return <Redirect href="/(tabs)" />;

  return <RegisterScreen />;
}
