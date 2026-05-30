import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Alert, Linking, Platform } from 'react-native';

export function useAuth() {
  const { user, session, isAuthenticated, isLoading, setSession } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Success', 'Check your email for the confirmation link!');
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        }
      });
      
      if (error) {
        Alert.alert('Error', error.message);
        console.error('OAuth Error:', error);
      } else if (data?.url) {
        if (Platform.OS === 'web') {
          window.location.assign(data.url);
        } else {
          Linking.openURL(data.url);
        }
      }
    } catch (err: any) {
      Alert.alert('Exception', err.message);
      console.error('OAuth Exception:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Error', error.message);
  };

  return {
    user,
    session,
    isAuthenticated,
    isStoreLoading: isLoading,
    loading,
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    logout,
  };
}
