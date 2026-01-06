/**
 * Auth Provider - MindEase
 * NextAuth SessionProvider wrapper for client components
 */
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider component
 * Wraps the application with NextAuth SessionProvider
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

