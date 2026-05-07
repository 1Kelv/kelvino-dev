import React, { createContext, useContext, useEffect, useState } from 'react';
import { Models } from 'appwrite';
import { account, ID } from './appwrite';

export const VERIFY_EMAIL_REQUIRED = 'VERIFY_EMAIL_REQUIRED';
export const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED';

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
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account.get()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      // SDK stores cookieFallback in localStorage automatically.
      // Hard-reload so the useEffect account.get() runs with the settled session.
      localStorage.removeItem('pendingVerification');
      window.location.replace('/app');
    } catch (err: any) {
      // Appwrite v1.4+ returns type 'user_email_not_verified' for unverified accounts
      if (err?.type === 'user_email_not_verified') {
        throw new Error(EMAIL_NOT_VERIFIED);
      }
      // Fallback: if we stored a pending verification for this email on this device, surface it
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
      window.location.replace('/app');
    } catch {
      // Appwrite requires email verification before sessions can be created.
      // Send a magic-link email so the user can verify and log in by clicking it.
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
    // No stored userId on this device — cannot resend without it.
    // Guide user to use forgot password instead.
    throw new Error('NO_STORED_USER');
  };

  const logout = async () => {
    await account.deleteSession('current');
    localStorage.removeItem('cookieFallback');
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    await account.createRecovery(email, `${window.location.origin}/reset-password`);
  };

  const resetPassword = async (userId: string, secret: string, password: string) => {
    await account.updateRecovery(userId, secret, password);
  };

  const createSessionFromToken = async (userId: string, secret: string) => {
    await account.createSession(userId, secret);
    // Hard-reload so the useEffect account.get() runs with the settled session.
    window.location.replace('/app');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword, createSessionFromToken, resendVerificationEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
