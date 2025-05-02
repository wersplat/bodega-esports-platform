import React, { useState } from 'react';
import { API_BASE } from '../../config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to send magic link');

      setMagicSent(true);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="main-content">
      <h1 className="text-4xl font-bold text-white mb-6">🔐 Login</h1>

      {magicSent ? (
        <p className="text-green-400">✅ Magic link sent to your email!</p>
      ) : (
        <form onSubmit={handleLogin} className="form" style={{ maxWidth: 400 }}>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />

          <button type="submit" className="form-button" style={{ marginTop: 12 }}>
            Send Magic Link
          </button>

          <p className="text-sm text-slate-400 mt-4">
            Don&apos;t have an account? Check Discord for an invite or register during onboarding.
          </p>
        </form>
      )}
    </div>
  );
}
