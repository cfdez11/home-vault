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
  RegisterFormValues,
  registerSchema,
} from "@/features/auth/schemas/auth-schemas";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { ArrowRight, AtSign, Lock } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { toast } from "sonner-native";

export default function RegisterScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: RegisterFormValues) {
    const { error, needsConfirmation } = await signUp(data.email, data.password);
    if (error) {
      setError("root", { message: error });
      return;
    }
    if (needsConfirmation) {
      toast.success("Revisa tu email para confirmar tu cuenta");
      router.replace("/auth/login");
    }
    // If no confirmation needed, onAuthStateChange fires and tab layout redirects automatically
  }

  return (
    <AuthScreen centered={false}>
      <AuthLogo />

      <View className="bg-card rounded-lg px-6 pt-8 pb-6 gap-5">
        <View className="gap-1">
          <Text className="text-lg font-manrope-bold text-foreground">
            Crear una cuenta
          </Text>
          <Text className="text-[13px] font-inter text-muted-foreground leading-5">
            Introduce tus datos para registrarte en la plataforma.
          </Text>
        </View>

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
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirmar contraseña"
              icon={Lock}
              placeholder="••••••••"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
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
              Crear Registro
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
            ¿Ya tiene una cuenta?
          </Text>
          <Button variant="link" onPress={() => router.back()}>
            Iniciar sesión
          </Button>
        </View>
      </View>

      <AuthTrustBadges />
    </AuthScreen>
  );
}
