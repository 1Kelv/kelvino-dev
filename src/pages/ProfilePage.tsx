import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ChevronLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { account } from '../lib/appwrite';
import { AppShell } from '../components/layout/AppShell';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/AuthContext';

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-brand-light flex items-center justify-center text-brand-mint">
          {icon}
        </div>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SuccessBadge({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 text-sm text-brand-mint bg-brand-light rounded-xl px-4 py-2"
    >
      <Check size={14} />
      {message}
    </motion.div>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Please enter your name.'); return; }
    setNameLoading(true);
    setNameError(null);
    setNameSuccess(false);
    try {
      await account.updateName(name.trim());
      setNameSuccess(true);
    } catch {
      setNameError('Failed to update name. Please try again.');
    } finally {
      setNameLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !emailPassword) { setEmailError('Email and current password are required.'); return; }
    setEmailLoading(true);
    setEmailError(null);
    setEmailSuccess(false);
    try {
      await account.updateEmail(newEmail.trim(), emailPassword);
      setEmailSuccess(true);
      setNewEmail('');
      setEmailPassword('');
    } catch (err: any) {
      setEmailError(err?.message?.includes('password') ? 'Incorrect password.' : 'Failed to update email. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) { setPasswordError('All password fields are required.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('New passwords do not match.'); return; }
    if (newPassword.length < 8) { setPasswordError('New password must be at least 8 characters.'); return; }
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await account.updatePassword(newPassword, currentPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err?.message?.includes('password') ? 'Current password is incorrect.' : 'Failed to update password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 pt-4 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors -ml-1"
          aria-label="Go back"
        >
          <ChevronLeft size={22} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h1>
      </div>
      <div className="px-4 pb-6 flex flex-col gap-4 mt-4">
        <div className="bg-gradient-to-br from-brand-mint to-brand-dark rounded-2xl px-5 py-4 text-white">
          <p className="text-white/80 text-xs mb-0.5">Signed in as</p>
          <p className="font-bold">{user?.name || 'Parent'}</p>
          <p className="text-white/70 text-sm">{user?.email}</p>
        </div>

        <Section title="Display Name" icon={<User size={16} />}>
          <form onSubmit={handleUpdateName} className="flex flex-col gap-3">
            <Input
              label="Name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameSuccess(false); }}
              placeholder="Your name"
              required
            />
            {nameError && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-2">{nameError}</p>}
            {nameSuccess && <SuccessBadge message="Name updated successfully" />}
            <Button type="submit" loading={nameLoading}>Update Name</Button>
          </form>
        </Section>

        <Section title="Email Address" icon={<Mail size={16} />}>
          <p className="text-xs text-gray-500 dark:text-gray-400">Current: <span className="font-medium text-gray-700 dark:text-gray-300">{user?.email}</span></p>
          <form onSubmit={handleUpdateEmail} className="flex flex-col gap-3">
            <Input
              label="New email address"
              type="email"
              value={newEmail}
              onChange={(e) => { setNewEmail(e.target.value); setEmailSuccess(false); }}
              placeholder="new@email.com"
              required
            />
            <Input
              label="Current password (to confirm)"
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {emailError && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-2">{emailError}</p>}
            {emailSuccess && <SuccessBadge message="Email updated successfully" />}
            <Button type="submit" loading={emailLoading}>Update Email</Button>
          </form>
        </Section>

        <Section title="Change Password" icon={<Lock size={16} />}>
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
            <Input
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setPasswordSuccess(false); }}
              placeholder="••••••••"
              required
            />
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {passwordError && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-2">{passwordError}</p>}
            {passwordSuccess && <SuccessBadge message="Password changed successfully" />}
            <Button type="submit" loading={passwordLoading}>Change Password</Button>
          </form>
        </Section>
      </div>
    </AppShell>
  );
}
