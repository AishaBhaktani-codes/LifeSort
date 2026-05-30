import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/store/authStore';
import { api } from '../src/lib/api';

export default function RootLayout() {
  const setSession = useAuthStore((state) => state.setSession);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      if (session) {
        api.post('/auth/sync').catch(console.warn);
      }
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
