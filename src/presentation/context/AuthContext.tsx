import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/infrastructure/services/supabase';
import { SubscriptionService, type Plan } from '@/infrastructure/services/SubscriptionService';
import type { User, Session } from '@supabase/supabase-js';

export type AuthMode = 'guest' | 'registered' | null;

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface RegisterResult {
  error?: string;
  needsConfirmation?: boolean;
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
  register: (name: string, email: string, password: string) => Promise<RegisterResult>;
  login: (email: string, password: string) => Promise<string | null>;
  loginWithGoogle: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<string | null>;
  resendVerificationForCurrent: () => Promise<string | null>;
  sendPasswordReset: (email: string) => Promise<string | null>;
  verifyPassword: (password: string) => Promise<string | null>;
  updatePassword: (newPassword: string) => Promise<string | null>;
  updateEmail: (newEmail: string) => Promise<string | null>;
  logout: () => Promise<void>;
  logoutOthers: () => Promise<string | null>;
  logoutEverywhere: () => Promise<void>;
  linkGoogle: () => Promise<string | null>;
  unlinkGoogle: () => Promise<string | null>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<string | null>;
  isEmailVerified: boolean;
  hasPasswordLogin: boolean;
  hasGoogleLogin: boolean;
  plan: Plan;
  isPro: boolean;
  planLoading: boolean;
  refreshPlan: () => Promise<void>;
  /* Dev-only override — when ON in dev, treats the current session as
   * Pro + registered so the owner can test gated features (settings,
   * unlimited widgets, paid-only styles) without buying a subscription
   * or running SQL on the profiles table. Wired through the dev panel
   * toggle. Has no effect in production builds. */
  devProOverride: boolean;
  setDevProOverride: (on: boolean) => void;
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

const DEFAULT_PLAN: Plan = {
  isPro: false,
  status: null,
  currentPeriodEnd: null,
  polarCustomerId: null,
  polarSubscriptionId: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem(GUEST_KEY) === 'true');
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan>(DEFAULT_PLAN);
  /* Dev-only Pro override — read from localStorage so the toggle
   * survives reloads. Disabled at build time outside dev so the flag
   * never affects production users. */
  const [devProOverride, setDevProOverrideState] = useState<boolean>(() => {
    if (!import.meta.env.DEV) return false;
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('peachy-dev-pro') === '1';
  });
  const setDevProOverride = useCallback((on: boolean) => {
    if (!import.meta.env.DEV) return;
    if (on) localStorage.setItem('peachy-dev-pro', '1');
    else localStorage.removeItem('peachy-dev-pro');
    setDevProOverrideState(on);
  }, []);
  // planLoading stays true until the first getPlan() resolves — surfaces
  // cleanly gate Pro-only UI so a logged-in user doesn't see a flash of
  // free-tier state (upgrade ring, Upgrade button) on hard refresh.
  const [planLoading, setPlanLoading] = useState(true);

  const refreshPlan = useCallback(async () => {
    if (!supabaseUser) {
      setPlan(DEFAULT_PLAN);
      setPlanLoading(false);
      return;
    }
    setPlanLoading(true);
    const next = await SubscriptionService.getPlan();
    setPlan(next);
    setPlanLoading(false);
  }, [supabaseUser]);

  useEffect(() => {
    if (supabaseUser) {
      void refreshPlan();
      // Claim any prior guest purchases bought under this email before the
      // user had an account. The SQL function is idempotent and only
      // touches rows with user_id IS NULL, so running it on every sign-in
      // is harmless but self-heals if the first call was missed.
      if (supabaseUser.email) {
        void supabase.rpc('link_purchases_to_user', {
          p_user_id: supabaseUser.id,
          p_email: supabaseUser.email,
        });
      }
    } else {
      setPlan(DEFAULT_PLAN);
      setPlanLoading(false);
    }
  }, [supabaseUser, refreshPlan]);

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
  /* Dev override synthesises a profile so guarded pages (Settings,
   * /studio account-sidebar) render without a real Supabase session.
   * Only kicks in when devProOverride is ON in dev. */
  const devUser: UserProfile = { name: 'Dev User', email: 'dev@peachy.studio', avatarUrl: undefined };
  const realUser = supabaseUser ? profileFromUser(supabaseUser) : isGuest ? { name: 'Guest User', email: 'guest@peachy.studio', avatarUrl: undefined } : null;
  const user = realUser ?? (devProOverride && import.meta.env.DEV ? devUser : null);

  const loginWithCode = useCallback((code: string): boolean => {
    // Don't shadow an existing registered session with the guest flag —
    // otherwise the user can hit PEACHY2026 while already signed in and
    // end up with both states set, which leaks on logout.
    if (supabaseUser) return false;
    if (code.trim().toUpperCase() === GUEST_CODE) {
      setIsGuest(true);
      localStorage.setItem(GUEST_KEY, 'true');
      return true;
    }
    return false;
  }, [supabaseUser]);

  const register = useCallback(async (name: string, email: string, password: string): Promise<RegisterResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        // Send the user to our dedicated /verify-email page after they click
        // the confirmation link. That page parses success/expired outcomes
        // and shows the right UI instead of landing on the marketing page.
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });
    if (error) return { error: error.message };
    // When email confirmation is required, Supabase returns a user without a session.
    const needsConfirmation = Boolean(data.user && !data.session);
    return { needsConfirmation };
  }, []);

  const resendConfirmation = useCallback(async (email: string): Promise<string | null> => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/verify-email` },
    });
    if (error) return error.message;
    return null;
  }, []);

  const sendPasswordReset = useCallback(async (email: string): Promise<string | null> => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return error.message;
    return null;
  }, []);

  const verifyPassword = useCallback(async (password: string): Promise<string | null> => {
    if (!supabaseUser?.email) return 'No email on account';
    // Re-authenticate against the current email. Success implies the password
    // is correct. Supabase issues a fresh session on success — our onAuthStateChange
    // will pick it up, which is harmless here (same user).
    const { error } = await supabase.auth.signInWithPassword({
      email: supabaseUser.email,
      password,
    });
    if (error) return error.message;
    return null;
  }, [supabaseUser]);

  const updatePassword = useCallback(async (newPassword: string): Promise<string | null> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return error.message;
    return null;
  }, []);

  const updateEmail = useCallback(async (newEmail: string): Promise<string | null> => {
    // Supabase sends a confirmation link to the NEW address (and, if
    // "Secure email change" is enabled in Supabase Auth, also to the old
    // one). The email on the auth.users row does NOT change until the
    // link is clicked.
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) return error.message;
    return null;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    return null;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    // If the user just deleted their account on this device, force Google to
    // show its account chooser. Otherwise Google silently re-auths the browser
    // session and the user lands back on /studio with no visible "switch account"
    // step — which feels like the deletion didn't take effect.
    const justDeleted = sessionStorage.getItem('peachy_account_deleted') === '1';
    sessionStorage.removeItem('peachy_account_deleted');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/studio',
        queryParams: justDeleted ? { prompt: 'select_account' } : undefined,
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

  const logoutOthers = useCallback(async (): Promise<string | null> => {
    const { error } = await supabase.auth.signOut({ scope: 'others' });
    if (error) return error.message;
    return null;
  }, []);

  const logoutEverywhere = useCallback(async () => {
    try { await supabase.auth.signOut({ scope: 'global' }); } catch { /* ignore */ }
  }, []);

  const linkGoogle = useCallback(async (): Promise<string | null> => {
    const { error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/settings' },
    });
    if (error) return error.message;
    return null;
  }, []);

  const unlinkGoogle = useCallback(async (): Promise<string | null> => {
    const { data, error: listErr } = await supabase.auth.getUserIdentities();
    if (listErr) return listErr.message;
    const google = data.identities.find(i => i.provider === 'google');
    if (!google) return 'No Google account connected.';
    const { error } = await supabase.auth.unlinkIdentity(google);
    if (error) return error.message;
    return null;
  }, []);

  const resendVerificationForCurrent = useCallback(async (): Promise<string | null> => {
    if (!supabaseUser?.email) return 'No email on account';
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: supabaseUser.email,
      options: { emailRedirectTo: `${window.location.origin}/verify-email` },
    });
    if (error) return error.message;
    return null;
  }, [supabaseUser]);

  const updateProfile = useCallback(async (profile: Partial<UserProfile>): Promise<string | null> => {
    if (!supabaseUser) return 'Not signed in';
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profile.name ?? supabaseUser.user_metadata?.full_name,
      },
    });
    if (error) return error.message;
    return null;
  }, [supabaseUser]);

  const identities = supabaseUser?.identities ?? [];
  const hasPasswordLogin = identities.some(i => i.provider === 'email');
  const hasGoogleLogin = identities.some(i => i.provider === 'google');
  const isEmailVerified = Boolean(supabaseUser?.email_confirmed_at);

  /* When devProOverride is ON in dev: treat the session as registered
   * + Pro so guarded UI (Settings page, Pro-only widget styles,
   * unlimited widgets) becomes accessible. Production builds always
   * see effectiveOverride === false because devProOverride is gated
   * behind import.meta.env.DEV at the setter. */
  const effectiveOverride = devProOverride && import.meta.env.DEV;
  const effectiveMode: AuthMode = effectiveOverride ? 'registered' : mode;
  const effectiveIsRegistered = effectiveOverride ? true : mode === 'registered';
  const effectiveIsPro = effectiveOverride ? true : plan.isPro;

  return (
    <AuthContext.Provider value={{
      mode: effectiveMode,
      user,
      supabaseUser,
      isLoggedIn: effectiveOverride ? true : mode !== null,
      isGuest,
      isRegistered: effectiveIsRegistered,
      loading,
      loginWithCode,
      register,
      login,
      loginWithGoogle,
      resendConfirmation,
      resendVerificationForCurrent,
      sendPasswordReset,
      verifyPassword,
      updatePassword,
      updateEmail,
      logout,
      logoutOthers,
      logoutEverywhere,
      linkGoogle,
      unlinkGoogle,
      updateProfile,
      isEmailVerified,
      hasPasswordLogin,
      hasGoogleLogin,
      plan,
      isPro: effectiveIsPro,
      planLoading,
      refreshPlan,
      devProOverride: effectiveOverride,
      setDevProOverride,
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
