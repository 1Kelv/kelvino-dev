// I render the login page with branding and the login form
import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { Heart } from 'lucide-react';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50 flex flex-col justify-center px-6 py-12">
      <div className="w-full max-w-sm mx-auto">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-mint flex items-center justify-center mb-4 shadow-lg">
            <Heart size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Mylestone</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Baby care tracking for medically complex infants
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Welcome back</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
