import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { logError } from '../../utils/logger';

// Hardcoded values for development
const SUPABASE_URL = typeof window !== 'undefined' ? window.NEXT_PUBLIC_SUPABASE_URL : '';
const SUPABASE_ANON_KEY = typeof window !== 'undefined' ? window.NEXT_PUBLIC_SUPABASE_ANON_KEY : '';

function PrivateRoute({ children, requireAdmin = false }) {
  const router = useRouter();
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
      logError('Error fetching session:', error);
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
    router.push('/');
    return null;
  }

  if (requireAdmin && user.email !== 'c.werwaiss@gmail.com') {
    router.push('/');
    return null;
  }

  return children;
}

// NOTE: This component is now redundant in Next.js routing. Consider removing it if you do not need route protection logic.
export default PrivateRoute;
