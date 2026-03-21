import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/app-header';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#f7f9fb]">
      <AppHeader title="Perfil" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-sm text-[#444651] mt-2">Próximamente</Text>
      </View>
    </SafeAreaView>
  );
}
