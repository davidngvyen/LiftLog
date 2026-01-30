"use client";

import React, { useState } from "react";
import { Dumbbell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { PixelClouds } from "@/components/PixelClouds";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/workouts' });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden">
      <PixelClouds />
      <div className="w-full max-w-md relative z-10">
        <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center border-4 border-black bg-gradient-to-br from-primary to-orange-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold uppercase leading-relaxed text-center">BetterSets</h1>
            <p className="mt-2 text-xs uppercase leading-relaxed text-muted-foreground text-center">
              Track your fitness journey
            </p>
          </div>

          <div className="space-y-4">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="h-12 w-full border-4 border-black bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all active:shadow-none active:translate-x-2 active:translate-y-2 uppercase text-xs font-bold"
              >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FcGoogle className="h-5 w-5" />
              )}
              {loading ? "Connecting..." : "Continue with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2 border-black" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground font-bold">Or</span>
              </div>
            </div>

            {/* Email Actions */}
            <div className="grid gap-4">
              <Button
                onClick={() => router.push('/login')}
                disabled={loading}
                className="h-12 w-full border-4 border-black bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all active:shadow-none active:translate-x-2 active:translate-y-2 uppercase text-xs font-bold"
              >
                Sign in with Email
              </Button>

              <Button
                onClick={() => router.push('/register')}
                disabled={loading}
                variant="ghost"
                className="h-12 w-full hover:bg-transparent text-muted-foreground hover:text-foreground uppercase text-xs font-bold"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
