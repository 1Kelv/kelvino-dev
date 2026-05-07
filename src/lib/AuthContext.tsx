import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Models } from 'appwrite';
import { account, client, ID } from './appwrite';

export const VERIFY_EMAIL_REQUIRED = 'VERIFY_EMAIL_REQUIRED';
export const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED';

const JWT_KEY = 'aw_jwt';
const JWT_REFRESH_MS = 14 * 60 * 1000; // refresh 1 minute before 15-min expiry

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (userId: string, secret: string, password: string) => Promise<void>;
  createSessionFromToken: (userId: string, secret: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function storeJWT() {
  const { jwt } = await account.createJWT();
  localStorage.setItem(JWT_KEY, jwt);
  client.setJWT(jwt);
}

async function loadSession(): Promise<Models.User<Models.Preferences> | null> {
  const jwt = localStorage.getItem(JWT_KEY);
  if (jwt) {
    client.setJWT(jwt);
    try {
      const u = await account.get();
      // Attempt rolling refresh — works if Appwrite accepts JWT-authed createJWT calls
      try { await storeJWT(); } catch { /* keep existing JWT */ }
      return u;
    } catch {
      client.setJWT('');
      localStorage.removeItem(JWT_KEY);
    }
  }
  // Fallback: try cookie/cookieFallback-based auth
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRefresh = () => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(async () => {
      try { await storeJWT(); } catch { /* session may have expired */ }
    }, JWT_REFRESH_MS);
  };

  const stopRefresh = () => {
    if (refreshTimer.current) { clearInterval(refreshTimer.current); refreshTimer.current = null; }
  };

  useEffect(() => {
    loadSession()
      .then((u) => {
        setUser(u);
        if (u) startRefresh();
      })
      .finally(() => setLoading(false));
    return stopRefresh;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      await storeJWT();
      localStorage.removeItem('pendingVerification');
      const u = await account.get();
      setUser(u);
      startRefresh();
      navigate('/app');
    } catch (err: any) {
      if (err?.type === 'user_email_not_verified') throw new Error(EMAIL_NOT_VERIFIED);
      try {
        const stored = localStorage.getItem('pendingVerification');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.email === email) throw new Error(EMAIL_NOT_VERIFIED);
        }
      } catch (inner: any) {
        if (inner?.message === EMAIL_NOT_VERIFIED) throw inner;
      }
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const userId = ID.unique();
    await account.create(userId, email, password, name);
    try {
      await account.createEmailPasswordSession(email, password);
      await storeJWT();
      localStorage.removeItem('pendingVerification');
      const u = await account.get();
      setUser(u);
      startRefresh();
      navigate('/app');
    } catch {
      await account.createMagicURLToken(userId, email, `${window.location.origin}/verify`);
      localStorage.setItem('pendingVerification', JSON.stringify({ userId, email }));
      throw new Error(VERIFY_EMAIL_REQUIRED);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    const stored = localStorage.getItem('pendingVerification');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.email === email) {
          await account.createMagicURLToken(parsed.userId, email, `${window.location.origin}/verify`);
          return;
        }
      } catch {}
    }
    throw new Error('NO_STORED_USER');
  };

  const logout = async () => {
    stopRefresh();
    try { await account.deleteSession('current'); } catch { /* session may already be gone */ }
    client.setJWT('');
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem('cookieFallback');
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    await account.createRecovery(email, `${window.location.origin}/reset-password`);
  };

  const resetPassword = async (userId: string, secret: string, password: string) => {
    await account.updateRecovery(userId, secret, password);
  };

  const refreshUser = async () => {
    const u = await account.get();
    setUser(u);
  };

  const createSessionFromToken = async (userId: string, secret: string) => {
    await account.createSession(userId, secret);
    await storeJWT();
    const u = await account.get();
    setUser(u);
    startRefresh();
    navigate('/app', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword, createSessionFromToken, resendVerificationEmail, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
