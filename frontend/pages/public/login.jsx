import React, { useState } from 'react';
import { useRouter } from 'next/router';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // assumes cookies/session handling
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Login failed');
      }

      router.push('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDiscordLogin = () => {
    window.location.href = 'https://api.bodegacatsgc.gg/auth/discord/login';
  };

  return (
    <div style={{
      paddingTop: '100px',
      paddingLeft: '24px',
      paddingRight: '24px',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)'
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.85)',
        borderRadius: '16px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
        padding: '32px 24px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 className="page-title" style={{ color: '#fff', textAlign: 'center', marginBottom: '16px' }}>Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid #3b82f6',
              background: '#fff',
              color: '#1e293b',
              fontWeight: 500
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
            autoComplete="current-password"
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid #3b82f6',
              background: '#fff',
              color: '#1e293b',
              fontWeight: 500
            }}
          />
          <button type="submit" className="form-button" style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            border: 'none'
          }}>
            Login
          </button>
        </form>

        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <span style={{ color: '#fff' }}>Don't have an account? </span>
          <a href="/register" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Register here</a>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button onClick={handleDiscordLogin} style={{
            backgroundColor: '#5865F2',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer'
          }}>
            Sign in with Discord
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;