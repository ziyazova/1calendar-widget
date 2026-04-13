import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/infrastructure/services/supabase';
import type { User, Session } from '@supabase/supabase-js';

export type AuthMode = 'guest' | 'registered' | null;

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  mode: AuthMode;
  user: UserProfile | null;
  supabaseUser: User | null;
  isLoggedIn: boolean;
  isGuest: boolean;
  isRegistered: boolean;
  loading: boolean;
  loginWithCode: (code: string) => boolean;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const GUEST_CODE = 'PEACHY2026';
const GUEST_KEY = 'peachy_guest';

const AuthContext = createContext<AuthContextType | null>(null);

function profileFromUser(user: User | null): UserProfile | null {
  if (!user) return null;
  return {
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    avatarUrl: user.user_metadata?.avatar_url,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem(GUEST_KEY) === 'true');
  const [loading, setLoading] = useState(true);

  // Listen to auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setSupabaseUser(s?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setSupabaseUser(s?.user ?? null);
      if (s?.user) {
        setIsGuest(false);
        localStorage.removeItem(GUEST_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mode: AuthMode = supabaseUser ? 'registered' : isGuest ? 'guest' : null;
  const user = supabaseUser ? profileFromUser(supabaseUser) : isGuest ? { name: 'Guest User', email: 'guest@peachy.studio', avatarUrl: undefined } : null;

  const loginWithCode = useCallback((code: string): boolean => {
    if (code.trim().toUpperCase() === GUEST_CODE) {
      setIsGuest(true);
      localStorage.setItem(GUEST_KEY, 'true');
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) return error.message;
    return null;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    return null;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/studio',
      },
    });
  }, []);

  const logout = useCallback(async () => {
    setIsGuest(false);
    localStorage.removeItem(GUEST_KEY);
    // Only call Supabase signOut for registered users, not guests
    if (supabaseUser) {
      try { await supabase.auth.signOut(); } catch { /* ignore */ }
    }
  }, [supabaseUser]);

  const updateProfile = useCallback(async (profile: Partial<UserProfile>) => {
    if (!supabaseUser) return;
    await supabase.auth.updateUser({
      data: {
        full_name: profile.name ?? supabaseUser.user_metadata?.full_name,
      },
    });
  }, [supabaseUser]);

  return (
    <AuthContext.Provider value={{
      mode,
      user,
      supabaseUser,
      isLoggedIn: mode !== null,
      isGuest,
      isRegistered: mode === 'registered',
      loading,
      loginWithCode,
      register,
      login,
      loginWithGoogle,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
