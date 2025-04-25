import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      navigate('/dashboard');
    }
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
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid #3b82f6',
              fontSize: '16px',
              background: '#fff',
              color: '#1e293b',
              outline: 'none',
              fontWeight: 500
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1.5px solid #3b82f6',
              fontSize: '16px',
              background: '#fff',
              color: '#1e293b',
              outline: 'none',
              fontWeight: 500
            }}
            required
          />
          <button type="submit" className="form-button" style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', border: 'none' }}>
            Login
          </button>
        </form>
        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <span style={{ color: '#fff' }}>Don't have an account? </span>
          <Link to="/register" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
