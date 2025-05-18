"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

export default function AuthCallbackPage() {
  const router = useRouter();
  const { handleAuthCallback } = useAuth();

  useEffect(() => {
    const run = async () => {
      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get("code");
      if (code) {
        try {
          await handleAuthCallback(code);
        } catch (error) {
          router.push("/auth/login?error=Unable to sign in");
        }
      } else {
        router.push("/auth/login?error=No code provided");
      }
    };
    run();
  }, [handleAuthCallback, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
        <div className="w-16 h-16 border-4 border-t-[#e11d48] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}