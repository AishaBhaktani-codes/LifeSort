import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/store/authStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const setSession = useAuthStore((state) => state.setSession);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
