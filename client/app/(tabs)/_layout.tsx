import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { useAuthStore } from '../../src/store/authStore';

export default function TabLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#10B981', headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="conversation" options={{ title: 'Voice' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="mood" options={{ title: 'Mood' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
