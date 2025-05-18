import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { logError } from '../../utils/logger';

import { API_BASE } from '../../config';

function PrivateRoute({ children, requireAdmin = false }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = React.useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        router.replace('/auth/login');
        return;
      }
      const response = await fetch(`${API_BASE}/auth-service/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        router.replace('/auth/login');
        return;
      }
      const userData = await response.json();
      if (requireAdmin && !userData.is_admin) {
        router.replace('/');
        return;
      }
      setUser(userData);
      setLoading(false);
    } catch (error) {
      logError('Error fetching user:', error);
      setLoading(false);
    }
  }, [router, requireAdmin]);

  useEffect(() => {
    getUser();
  }, [getUser]);

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
