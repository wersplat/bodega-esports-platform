'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

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
  const supabase = createClientComponentClient();

  // Fetch user profile
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setProfile(data);
      setIsAdmin(data?.is_admin ?? false);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, [supabase]);

  // Check admin status
  const checkAdminStatus = useCallback(async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }

    try {
      const profile = await fetchUserProfile(user.id);
      const adminStatus = profile?.is_admin ?? false;
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  }, [fetchUserProfile]);

  // Get initial session and set up auth state listener
  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await checkAdminStatus(session.user);
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (mounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await checkAdminStatus(session.user);
          } else {
            setProfile(null);
            setIsAdmin(false);
          }
        }
      }
    );

    // Initial session check
    getInitialSession();

    // Cleanup
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [checkAdminStatus, supabase.auth]);

  // Sign out helper
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    profile,
    isLoading,
    isAdmin,
    isAuthenticated: !!user,
    signOut,
    refresh: () => checkAdminStatus(user),
  };
}

// Helper function to get the current session
export async function getSession(): Promise<Session | null> {
  const supabase = createClientComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Helper function to get the current user
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}
