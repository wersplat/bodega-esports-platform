import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Hardcoded values for development
const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

function PrivateRoute({ children, requireAdmin = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Updated fetch calls to use hardcoded values
  const getUser = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/session`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const session = await response.json();
      setUser(session?.user ?? null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching session:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (requireAdmin && user.email !== 'c.werwaiss@gmail.com') {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
