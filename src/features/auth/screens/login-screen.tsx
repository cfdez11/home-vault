import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, AtSign, Lock, ArrowRight, ShieldCheck, Database } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface LoginScreenProps {
  onLogin?: () => void;
  onRegister?: () => void;
}

export default function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colors = useThemeColors();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingVertical: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-8 gap-2">
            <Building2 size={48} color={colors.primary} />
            <Text style={{ fontFamily: 'Manrope_700Bold' }} className="text-[26px] text-primary text-center">
              Historial de Vivienda
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-sm text-on-surface-variant text-center">
              El Archivero Digital de su Propiedad
            </Text>
          </View>

          <View className="w-full bg-surface rounded-2xl p-6 shadow-md gap-4">
            <View className="flex-row items-center bg-surface-low rounded-xl px-[14px] h-[52px]">
              <AtSign size={20} color={colors.onSurfaceVariant} style={{ marginRight: 10 }} />
              <TextInput
                style={{ fontFamily: 'Inter_400Regular' }}
                className="flex-1 text-[15px] text-on-surface"
                placeholder="Correo electrónico"
                placeholderTextColor={colors.onSurfaceVariant}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View className="flex-row items-center bg-surface-low rounded-xl px-[14px] h-[52px]">
              <Lock size={20} color={colors.onSurfaceVariant} style={{ marginRight: 10 }} />
              <TextInput
                style={{ fontFamily: 'Inter_400Regular' }}
                className="flex-1 text-[15px] text-on-surface"
                placeholder="Contraseña"
                placeholderTextColor={colors.onSurfaceVariant}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity className="self-end">
              <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-[13px] text-primary">¿Olvidó su clave?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center bg-primary rounded-full h-[52px] gap-2"
              onPress={onLogin}
            >
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-base text-on-primary">Acceder al Historial</Text>
              <ArrowRight size={20} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mt-6 flex-wrap justify-center">
            <Text style={{ fontFamily: 'Inter_400Regular' }} className="text-sm text-on-surface-variant">¿No tiene una cuenta registrada? </Text>
            <TouchableOpacity onPress={onRegister}>
              <Text style={{ fontFamily: 'Inter_600SemiBold' }} className="text-sm text-primary">Crear un Registro Nuevo</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3 mt-6">
            <View className="flex-row items-center bg-info-container rounded-full px-[14px] py-2 gap-[6px]">
              <ShieldCheck size={16} color={colors.info} />
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-info">Seguro</Text>
            </View>
            <View className="flex-row items-center bg-info-container rounded-full px-[14px] py-2 gap-[6px]">
              <Database size={16} color={colors.info} />
              <Text style={{ fontFamily: 'Inter_500Medium' }} className="text-[13px] text-info">Cifrado</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
