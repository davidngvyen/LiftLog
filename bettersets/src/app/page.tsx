"use client";

import React, { useState } from "react";
import { Dumbbell } from "lucide-react"; // using Chrome icon as Google proxy if needed, or just text
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
import { PixelClouds } from "@/components/PixelClouds";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleEnterApp = () => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, prompt to use Google as we haven't set up Credentials provider yet
    toast.info("Please use Google Sign In for now!");
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
            {/* Google Sign In - Primary Option */}
            <Button
              onClick={handleEnterApp}
              disabled={loading}
              className="h-12 w-full border-4 border-black bg-white text-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all active:shadow-none active:translate-x-2 active:translate-y-2 uppercase text-xs font-bold"
            >
              {loading ? "Loading..." : "ENTER APP (GUEST MODE)"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2 border-black" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground font-bold">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 opacity-70">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase font-bold">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="JOHN DOE"
                    className="h-12 border-4 border-black bg-gray-50 uppercase text-xs"
                    disabled
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase font-bold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="WARRIOR@EXAMPLE.COM"
                  className="h-12 border-4 border-black bg-gray-50 uppercase text-xs"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase font-bold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-4 border-black bg-gray-50"
                  disabled
                />
              </div>

              <Button
                type="submit"
                disabled
                className="h-12 w-full border-4 border-black bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase text-xs font-bold opacity-50 cursor-not-allowed"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase font-bold"
              >
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <span className="text-primary underline">
                  {isSignUp ? "Sign In" : "Sign Up"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
