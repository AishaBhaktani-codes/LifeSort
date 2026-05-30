import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  DancingScript_500Medium,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/store/authStore';
import { api } from '../src/lib/api';

export default function RootLayout() {
  const setSession = useAuthStore((state) => state.setSession);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const [fontsLoaded, fontError] = useFonts({
    DancingScript_500Medium,
    DancingScript_700Bold,
  });

  useEffect(() => {
    // Initial session check — always call setIsLoading(false) so page never stays blank
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        if (session) {
          api.post('/auth/sync').catch(console.warn);
        }
      })
      .catch((err) => {
        console.warn('Supabase getSession error:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        api.post('/auth/sync').catch(console.warn);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Wait for fonts — show a subtle loader instead of a blank screen
  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#a78bfa" size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
