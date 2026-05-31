import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  preferences: Record<string, any>;
  createdAt: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      setProfile(res.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<Pick<UserProfile, 'displayName' | 'preferences'>>) => {
    try {
      setLoading(true);
      const res = await api.put('/users/profile', updates);
      setProfile(res.data.data);
      setError(null);
      return res.data.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
}
