/**
 * useAuth Hook - MindEase
 * Custom hook for NextAuth session management
 */
"use client";

import { useSession } from "next-auth/react";
import { authService } from "@/services/auth";
import { useMemo } from "react";

/**
 * Custom hook for authentication
 * Provides session data and auth methods
 */
export function useAuth() {
  const { data: session, status } = useSession();

  const user = useMemo(() => {
    return session?.user
      ? {
          uid: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }
      : null;
  }, [session?.user]);

  return {
    user,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    signIn: authService.signInWithGoogle,
    signOut: authService.signOut,
  };
}

