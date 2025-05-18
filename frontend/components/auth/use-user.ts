'use client';

import { useState, useEffect } from 'react';

// Define the User interface to match backend and UI usage
export interface User {
  id: string;
  name?: string; // Full name if available
  email: string;
  avatarUrl?: string;
  is_admin?: boolean;
  // Add any additional properties used in your UI
}

// Define a minimal Session type if needed
export interface Session {
  user: User;
  // Add any additional session properties as needed
}


interface Profile {
  id: string;
  is_admin?: boolean;
  // Add other profile fields as needed
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // TODO: Implement logic to fetch current user and session from your custom auth service
  // Replace all Supabase session and auth state logic with your own
  useEffect(() => {
    let mounted = true;
    const getInitialSession = async () => {
      try {
        setIsLoading(true)
        // TODO: Replace with actual backend endpoint to get current user/session
        const res = await fetch('/api/auth/session')
        const result = await res.json()
        if (mounted) {
          setUser(result.user ?? null)
          setProfile(result.profile ?? null)
          setIsAdmin(result.profile?.is_admin ?? false)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }
    getInitialSession()
    // TODO: Set up custom auth event listeners if needed
    return () => {
      mounted = false
      // TODO: Remove event listeners if any
    }
  }, [])

  // Sign out helper
  const signOut = async () => {
    // TODO: Replace with actual backend endpoint to sign out
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setProfile(null)
    setIsAdmin(false)
  };

  return {
    user,
    profile,
    isLoading,
    isAdmin,
    isAuthenticated: !!user,
    signOut,
    refresh: () => (user),
  };
}

// Helper function to get the current session


// Helper function to get the current user
export async function getCurrentUser(): Promise<User | null> {
  // TODO: Replace with actual backend endpoint to get current user
  // Example: const res = await fetch('/api/auth/session');
  // const result = await res.json();
  // return result.user ?? null;
  return null;
}
