// I render the registration form with name, email, and password inputs
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../lib/AuthContext';

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password);
      navigate('/app');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Your name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Jane Smith"
        autoComplete="name"
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Min. 8 characters"
        autoComplete="new-password"
        required
        minLength={8}
      />
      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}
      <Button type="submit" size="lg" loading={loading}>
        Create Account
      </Button>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-mint font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
