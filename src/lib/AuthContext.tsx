import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Models } from 'appwrite';
import { account, client, ID } from './appwrite';

export const VERIFY_EMAIL_REQUIRED = 'VERIFY_EMAIL_REQUIRED';
export const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED';

const SESSION_KEY = 'aw_session';

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

// Persist the session secret and activate it on the client.
// This sends X-Appwrite-Session instead of relying on cookies,
// which fixes login on Mac (Safari ITP blocks cross-origin cookies).
function storeAndActivateSession(secret: string) {
  localStorage.setItem(SESSION_KEY, secret);
  client.setSession(secret);
}

async function loadSession(): Promise<Models.User<Models.Preferences> | null> {
  const secret = localStorage.getItem(SESSION_KEY);
  if (secret) {
    client.setSession(secret);
    try {
      return await account.get();
    } catch {
      // Session expired or invalid
      client.setSession('');
      localStorage.removeItem(SESSION_KEY);
    }
  }
  // No stored session — try cookie-based auth (works when cookies aren't blocked)
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

  useEffect(() => {
    loadSession()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      localStorage.removeItem('pendingVerification');
      storeAndActivateSession(session.secret);
      const u = await account.get();
      setUser(u);
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
      const session = await account.createEmailPasswordSession(email, password);
      localStorage.removeItem('pendingVerification');
      storeAndActivateSession(session.secret);
      const u = await account.get();
      setUser(u);
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
    try { await account.deleteSession('current'); } catch { /* session may already be gone */ }
    client.setSession('');
    localStorage.removeItem(SESSION_KEY);
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
    const session = await account.createSession(userId, secret);
    storeAndActivateSession(session.secret);
    const u = await account.get();
    setUser(u);
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
