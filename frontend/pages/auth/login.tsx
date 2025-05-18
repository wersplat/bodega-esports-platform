"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/auth/auth-provider";

export function Login() {
  const { signInWithDiscord, isLoading, user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Bodega Esports</h1>
          <p className="text-[#94a3b8] mt-1">Road to $25K</p>
        </div>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#0f172a]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#1e293b] px-2 text-[#94a3b8]">Sign in with</span>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => signInWithDiscord()}
              disabled={isLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542..."
                  fill="#f8fafc"
                />
              </svg>
              <span>Discord</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Login;
