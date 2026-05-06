import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { FeedsPage } from './pages/FeedsPage';
import { NappiesPage } from './pages/NappiesPage';
import { MedicationsPage } from './pages/MedicationsPage';
import { GrowthPage } from './pages/GrowthPage';
import { SymptomsPage } from './pages/SymptomsPage';
import { SleepPage } from './pages/SleepPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { NotesPage } from './pages/NotesPage';
import { AiPage } from './pages/AiPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading Mylestone...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify" element={<VerifyEmailPage />} />
      <Route path="/app" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/feeds" element={<ProtectedRoute><FeedsPage /></ProtectedRoute>} />
      <Route path="/nappies" element={<ProtectedRoute><NappiesPage /></ProtectedRoute>} />
      <Route path="/medications" element={<ProtectedRoute><MedicationsPage /></ProtectedRoute>} />
      <Route path="/growth" element={<ProtectedRoute><GrowthPage /></ProtectedRoute>} />
      <Route path="/symptoms" element={<ProtectedRoute><SymptomsPage /></ProtectedRoute>} />
      <Route path="/sleep" element={<ProtectedRoute><SleepPage /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
      <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute><AiPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
