import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

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
    logout,
  };
}
