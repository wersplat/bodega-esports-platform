import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
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
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="page-title">Register</h1>
      {magicSent ? (
        <p className="text-green-400">✅ Magic link sent to your email!</p>
      ) : (
        <form className="form" onSubmit={handleRegister}>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">{error}</div>
          )}
          <input
            type="email"
            placeholder="Email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="form-button" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Magic Link'}
          </button>
          <p className="text-sm text-slate-400 mt-4">
            Already have an account? <Link href="/public/login" className="text-[#e11d48] hover:underline">Sign in</Link>
          </p>
        </form>
      )}
    </div>
  );
}