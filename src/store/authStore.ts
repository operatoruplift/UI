import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSupabase } from '@/lib/supabase';
import { getOrCreateDevice, getOrCreateDeviceId } from '@/services/dashboard/devices/deviceService';
import type { SupabaseClient, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  refreshToken: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<{ requiresConfirmation: boolean }>;
  loginWithX: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{ requiresConfirmation: boolean }>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateProfile: (name: string, email?: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const extractUserName = (userMetadata: any, email: string | undefined): string =>
  userMetadata?.full_name || userMetadata?.name || email?.split('@')[0] || 'User';

const createUserFromSession = (session: Session, email?: string): User => {
  const userMetadata = session.user.user_metadata;
  return {
    id: session.user.id,
    email: session.user.email || email || '',
    name: extractUserName(userMetadata, session.user.email),
  };
};

const clearAuthState = (set: any) => {
  set({
    user: null,
    token: null,
    isAuthenticated: false,
  });
};

const setAuthState = (set: any, session: Session, email?: string) => {
  set({
    user: createUserFromSession(session, email),
    token: session.access_token,
    isAuthenticated: true,
  });
};

// --- Device Init ---
const initializeDevice = async () => {
  try {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    const deviceId = getOrCreateDeviceId();
    let deviceInfo: any = {};

    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      deviceInfo = await (window as any).electronAPI.getDeviceInfo();
    }

    if (!deviceInfo.platform && typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || navigator.platform || '';
      if (ua.includes('Win')) deviceInfo.platform = 'win32';
      else if (ua.includes('Mac')) deviceInfo.platform = 'darwin';
      else if (ua.includes('Linux')) deviceInfo.platform = 'linux';
    }

    const platformNames: Record<string, string> = {
      win32: 'Windows',
      darwin: 'macOS',
      linux: 'Linux',
    };

    const platform = platformNames[deviceInfo.platform] || 'Unknown';
    const deviceName =
      typeof navigator !== 'undefined'
        ? `${platform} - ${navigator.platform || 'Device'}`
        : `${platform} Device`;

    await getOrCreateDevice({
      device_id: deviceId,
      name: deviceName,
      platform,
      user_id: user.id,
      app_version: deviceInfo.appVersion || '0.0.1-beta',
      metadata: {
        osVersion: deviceInfo.osVersion || '',
        arch: deviceInfo.arch || '',
      },
    });
  } catch (err) {
    console.error('Error initializing device:', err);
  }
};

// --- Zustand Store ---
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),

      refreshToken: async () => {
        try {
          const supabase = await getSupabase();
          const { data, error } = await supabase.auth.getSession();
          if (error || !data?.session) {
            clearAuthState(set);
            return null;
          }
          setAuthState(set, data.session);
          return data.session.access_token;
        } catch (err) {
          console.error('Error refreshing token:', err);
          clearAuthState(set);
          return null;
        }
      },

      login: async (email, password) => {
        const supabase = await getSupabase();
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          if (!data.session) throw new Error('No session returned');
          setAuthState(set, data.session, email);
          await initializeDevice();
          return { requiresConfirmation: false };
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithX: async () => {
        const supabase = await getSupabase();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'twitter',
          options: { redirectTo: window.location.origin },
        });
        if (error) throw error;
      },

      signup: async (email, password, name) => {
        const supabase = await getSupabase();
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name, name } },
          });
          if (error) throw error;
          if (data.session) {
            setAuthState(set, data.session, email);
            await initializeDevice();
            return { requiresConfirmation: false };
          }
          return { requiresConfirmation: true };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const supabase = await getSupabase();
        await supabase.auth.signOut();
        clearAuthState(set);
      },

      initializeAuth: async () => {
        const supabase = await getSupabase();
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.getSession();
          const session = data?.session;
          if (error) throw error;

          if (session?.user) {
            setAuthState(set, session);
            await initializeDevice();
          } else {
            clearAuthState(set);
          }

          // ✅ Only add listener once
          if (!(window as any).__SUPABASE_LISTENER__) {
            (window as any).__SUPABASE_LISTENER__ = true;
            supabase.auth.onAuthStateChange((_event, session) => {
              console.log('🔁 Auth state changed:', _event);
              if (session?.user) {
                setAuthState(set, session);
              } else {
                clearAuthState(set);
              }
            });
          }
        } catch (err) {
          console.error('Auth init error:', err);
          clearAuthState(set);
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (name, email) => {
        const supabase = await getSupabase();
        set({ isLoading: true });
        try {
          const updateData: any = { data: { full_name: name, name } };
          if (email) updateData.email = email;
          const { data, error } = await supabase.auth.updateUser(updateData);
          if (error) throw error;
          if (data.user) set({ user: createUserFromSession({ user: data.user } as Session) });
        } finally {
          set({ isLoading: false });
        }
      },

      updatePassword: async (newPassword) => {
        const supabase = await getSupabase();
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.updateUser({ password: newPassword });
          if (error) throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export async function withAuth<T>(
  callback: (supabase: SupabaseClient, token: string) => Promise<T>
): Promise<T> {
  const store = useAuthStore.getState();
  const supabase = await getSupabase();

  let token = store.token;

  // ✅ Ensure token is valid
  if (!token || isTokenExpired(token)) {
    console.log('Refreshing token manually...');
    token = await store.refreshToken();
    if (!token) throw new Error('Session expired. Please log in again.');
  }

  // ✅ Use token directly — no getSession, no setSession
  return callback(supabase, token);
}

// Helper (if you’re using JWTs)
function isTokenExpired(token: string) {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}
