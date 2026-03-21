import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import {
    AuthDivider,
    AuthLogo,
    AuthTrustBadges,
    GoogleIcon,
} from "@/features/auth/components/auth-ui";
import { useAuth } from "@/features/auth/context/auth-context";
import {
    LoginFormValues,
    loginSchema,
} from "@/features/auth/schemas/auth-schemas";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { ArrowRight, AtSign, Lock } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

export default function LoginScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormValues) {
    const { error } = await signIn(data.email, data.password);
    if (error) setError("root", { message: error });
  }

  return (
    <AuthScreen>
      <AuthLogo />

      <View className="bg-card rounded-lg px-6 pt-8 pb-6 gap-5">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              icon={AtSign}
              placeholder="nombre@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Contraseña"
              icon={Lock}
              placeholder="••••••••"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              rightLabel={
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                  onPress={() => router.push("/auth/forgot-password")}
                >
                  ¿Olvidó su clave?
                </Button>
              }
            />
          )}
        />

        {errors.root && (
          <Text className="text-[13px] font-inter text-destructive text-center">
            {errors.root.message}
          </Text>
        )}

        <Button
          size="lg"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          className="mt-1"
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-inter-semibold text-primary-foreground">
              Acceder al Historial
            </Text>
            <ArrowRight size={18} color={colors.primaryForeground} />
          </View>
        </Button>

        <AuthDivider label="O bien" />

        <Button
          variant="outline"
          size="lg"
          onPress={async () => {
            const { error } = await signInWithGoogle();
            if (error) setError("root", { message: error });
          }}
        >
          <View className="flex-row items-center gap-3">
            <GoogleIcon />
            <Text className="text-base font-inter-semibold text-foreground">
              Continuar con Google
            </Text>
          </View>
        </Button>

        <View className="items-center gap-1 mt-2">
          <Text className="text-[13px] font-inter text-muted-foreground">
            ¿No tiene una cuenta registrada?
          </Text>
          <Button variant="link" onPress={() => router.push("/auth/register")}>
            Crear un Registro Nuevo
          </Button>
        </View>
      </View>

      <AuthTrustBadges />
    </AuthScreen>
  );
}
