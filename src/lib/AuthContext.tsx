import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Models } from 'appwrite';
import { account, client, ID } from './appwrite';

export const VERIFY_EMAIL_REQUIRED = 'VERIFY_EMAIL_REQUIRED';
export const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED';

const JWT_KEY = 'aw_jwt';
const JWT_REFRESH_MS = 14 * 60 * 1000;

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

// Store a JWT for environments where session cookies are blocked (Mac ITP).
// Sets the JWT globally on the Appwrite client for all subsequent requests.
async function activateJWT() {
  const { jwt } = await account.createJWT();
  localStorage.setItem(JWT_KEY, jwt);
  client.setJWT(jwt);
}

// After a successful session creation, try cookie auth first.
// If that fails (cross-origin cookie blocked), fall back to JWT.
// This avoids the "JWT and cookie in same request" error on mobile.
async function getSessionUser(): Promise<Models.User<Models.Preferences>> {
  try {
    return await account.get();
  } catch {
    // Cookie blocked — generate JWT and retry
    await activateJWT();
    return await account.get();
  }
}

async function loadSession(): Promise<Models.User<Models.Preferences> | null> {
  const jwt = localStorage.getItem(JWT_KEY);
  if (jwt) {
    client.setJWT(jwt);
    try {
      const u = await account.get();
      // Attempt rolling refresh while JWT auth is active
      try { await activateJWT(); } catch { /* keep existing JWT */ }
      return u;
    } catch {
      client.setJWT('');
      localStorage.removeItem(JWT_KEY);
    }
  }
  // No JWT stored — try cookie-based auth (works on mobile/non-ITP browsers)
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
      // Only refresh if we're in JWT mode (not cookie mode)
      if (!localStorage.getItem(JWT_KEY)) return;
      try { await activateJWT(); } catch { /* session expired */ }
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
      localStorage.removeItem('pendingVerification');
      const u = await getSessionUser();
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
      localStorage.removeItem('pendingVerification');
      const u = await getSessionUser();
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
    const u = await getSessionUser();
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
