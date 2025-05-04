import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setMagicSent(true);
    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-content">
      <h1 className="text-4xl font-bold text-white mb-6">🔐 Login</h1>
      {magicSent ? (
        <p className="text-green-400">✅ Magic link sent to your email!</p>
      ) : (
        <form onSubmit={handleLogin} className="form" style={{ maxWidth: 400 }}>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">{error}</div>
          )}
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
          <button type="submit" className="form-button" style={{ marginTop: 12 }} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Magic Link'}
          </button>
          <p className="text-sm text-slate-400 mt-4">
            Don&apos;t have an account? <Link href="/public/register" className="text-[#e11d48] hover:underline">Register</Link>
          </p>
        </form>
      )}
    </div>
  );
}
