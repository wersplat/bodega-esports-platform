'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../auth/use-user';
import { logError } from '@/utils/logger';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/auth/login' 
}) => {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useUser();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    // Skip if still loading user data
    if (isLoading) return;

    // Check if user is authenticated
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // Check admin status if required
    if (requireAdmin && !isAdmin) {
      logError('Access denied: Admin privileges required');
      router.push('/unauthorized');
      return;
    }

    // User is authorized
    setIsAuthorized(true);
    setIsChecking(false);
  }, [user, isLoading, isAdmin, requireAdmin, router, redirectTo]);

  // Show loading state
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Render children if authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Default return (should redirect in most cases)
  return null;
};

export default PrivateRoute;
