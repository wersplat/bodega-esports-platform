import React, { useEffect, useState, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { logError } from '../../utils/logger';

const SUPABASE_URL: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface PrivateRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requireAdmin = false }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getUser = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/session`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY ?? '',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY ?? ''}`
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
    return <Navigate to="/" />;
  }

  if (requireAdmin && user.email !== 'c.werwaiss@gmail.com') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
