import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true, // Start as true while we check async storage
  token: null,
  setUser: (user) => set((state) => ({ user, isAuthenticated: !!user || !!state.session })),
  setSession: (session) => set((state) => ({ 
    session, 
    token: session?.access_token || null,
    isAuthenticated: !!session, 
    user: session?.user || null 
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, session: null, token: null, isAuthenticated: false }),
}));
