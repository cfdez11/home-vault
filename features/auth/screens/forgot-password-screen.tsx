import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import { AuthLogo, AuthTrustBadges } from "@/features/auth/components/auth-ui";
import { useAuth } from "@/features/auth/context/auth-context";
import {
    ForgotPasswordFormValues,
    forgotPasswordSchema,
} from "@/features/auth/schemas/auth-schemas";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AtSign, CheckCircle } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { resetPassword } = useAuth();
  const [sent, setSent] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    const { error } = await resetPassword(data.email);
    if (error) setError("root", { message: error });
    else setSent(true);
  }

  return (
    <AuthScreen>
      <AuthLogo />

      <View className="bg-card rounded-lg px-6 pt-8 pb-6 gap-5">
        {sent ? (
          <View className="items-center gap-4 py-4">
            <View className="bg-success-subtle w-16 h-16 rounded-full items-center justify-center">
              <CheckCircle size={32} color={colors.success} />
            </View>
            <Text className="text-lg font-manrope-bold text-foreground text-center">
              Email enviado
            </Text>
            <Text className="text-[13px] font-inter text-muted-foreground text-center leading-5">
              Hemos enviado las instrucciones para restablecer tu contraseña a{" "}
              <Text className="font-inter-semibold text-foreground">
                {getValues("email")}
              </Text>
            </Text>
            <Button
              size="lg"
              className="w-full mt-2"
              onPress={() => router.back()}
            >
              Volver al inicio de sesión
            </Button>
          </View>
        ) : (
          <>
            <View className="gap-1">
              <Text className="text-lg font-manrope-bold text-foreground">
                ¿Olvidó su contraseña?
              </Text>
              <Text className="text-[13px] font-inter text-muted-foreground leading-5">
                Introduce tu email y te enviaremos un enlace para restablecerla.
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
              Enviar instrucciones
            </Button>

            <View className="items-center mt-2">
              <Button variant="link" onPress={() => router.back()}>
                Volver al inicio de sesión
              </Button>
            </View>
          </>
        )}
      </View>

      <AuthTrustBadges />
    </AuthScreen>
  );
}
