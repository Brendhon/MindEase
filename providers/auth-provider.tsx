"use client";

import { useState, useCallback } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthContext, AuthUser } from "@/contexts/auth-context";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: AuthUser | null;
}

/**
 * Auth Provider - MindEase
 * 
 * Provides authentication context to children components.
 * 
 * This provider manages ONLY basic state (user, loading, error).
 * All business logic is handled by the useAuth hook.
 * 
 * Wraps the application with NextAuth SessionProvider and provides
 * custom auth context for state management.
 * 
 * @example
 * ```tsx
 * // Normal usage
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * 
 * // With initial user (for testing/stories)
 * <AuthProvider initialUser={{ uid: "123", email: "test@example.com", name: "Test", image: null }}>
 *   <Component />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Internal setters for useAuth hook to use
  const setUserState = useCallback(
    (newUser: AuthUser | null | ((prev: AuthUser | null) => AuthUser | null)) => 
      setUser(newUser),
    []
  );

  const setLoadingState = useCallback((loading: boolean) => setIsLoading(loading), []);

  const setErrorState = useCallback((err: Error | null) => setError(err), []);

  return (
    <SessionProvider>
      <AuthContext.Provider
        value={{
          user,
          isLoading,
          error,
          _setUser: setUserState,
          _setLoading: setLoadingState,
          _setError: setErrorState,
        }}
      >
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
}

