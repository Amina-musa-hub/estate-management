import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = 'http://localhost:5000';

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      login(data.user, data.token);
      navigate('/dashboard');
    } catch {
      setError('Cannot reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* Left: image */}
      <div className="relative h-64 w-full lg:h-auto lg:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80"
          alt="Modern estate"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white lg:p-12">
          <p className="text-xs font-medium uppercase tracking-widest text-white/70 lg:text-sm">
            Estate Management
          </p>
          <h3 className="mt-2 max-w-sm text-2xl font-semibold leading-tight lg:text-3xl">
            Manage your properties with confidence.
          </h3>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <form onSubmit={handleLogin} className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B4F3B] to-[#2E4A3B] shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6 text-white"
              >
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5 9.5V21h14V9.5" />
                <path d="M9 21v-6h6v6" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-800">Estate Management</span>
          </div>

          <h1 className="text-3xl font-semibold text-gray-800">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account to continue.</p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-[#6C7A5C] focus:ring-2 focus:ring-[#6C7A5C]/20 focus:outline-none"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-[#6C7A5C] focus:ring-2 focus:ring-[#6C7A5C]/20 focus:outline-none"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mt-0.5 h-4 w-4 shrink-0"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2E4A3B] to-[#6B4F3B] py-3 font-medium text-white shadow-lg transition hover:from-[#2E4A3B] hover:to-[#6B4F3B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="mt-8 text-center text-xs text-gray-400">
            Secure access · Estate Management System
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;