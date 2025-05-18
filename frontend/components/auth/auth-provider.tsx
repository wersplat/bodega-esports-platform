"use client"

import React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export type User = {
  id: string;
  role: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    [key: string]: any;
  };
};

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signInWithDiscord: () => Promise<void>;
  handleAuthCallback: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const res = await fetch("/auth-service/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
        removeToken();
      }
    } catch (error) {
      setUser(null);
      removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signInWithDiscord = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/auth-service/auth/login/discord");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async (code: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/auth-service/auth/callback/discord?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        await fetchUser();
        router.push("/"); // redirect to home or dashboard
      }
    } catch (error) {
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      removeToken();
      setUser(null);
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithDiscord, handleAuthCallback, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};