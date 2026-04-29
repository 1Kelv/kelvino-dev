import React, { createContext, useContext, useEffect, useState } from 'react';
import { Models } from 'appwrite';
import { account, ID } from './appwrite';

export const VERIFY_EMAIL_REQUIRED = 'VERIFY_EMAIL_REQUIRED';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (userId: string, secret: string, password: string) => Promise<void>;
  createSessionFromToken: (userId: string, secret: string) => Promise<void>;
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
    await account.createEmailPasswordSession(email, password);
    const currentUser = await account.get();
    setUser(currentUser);
  };

  const register = async (name: string, email: string, password: string) => {
    const userId = ID.unique();
    await account.create(userId, email, password, name);
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch {
      // Appwrite requires email verification before sessions can be created.
      // Send a magic-link email so the user can verify and log in by clicking it.
      await account.createEmailToken(userId, email, false);
      throw new Error(VERIFY_EMAIL_REQUIRED);
    }
  };

  const logout = async () => {
    await account.deleteSession('current');
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
    const currentUser = await account.get();
    setUser(currentUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword, createSessionFromToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
