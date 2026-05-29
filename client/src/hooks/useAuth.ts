import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, isAuthenticated, setUser, setToken, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    setLoading(true);
    // Google Sign-In logic using expo-auth-session and Supabase goes here
    setLoading(false);
  };

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    // Email Sign-In logic using Supabase goes here
    setLoading(false);
  };

  return {
    user,
    isAuthenticated,
    loading,
    loginWithGoogle,
    loginWithEmail,
    logout,
  };
}
