/**
 * useAuth Hook - MindEase
 * 
 * Centralized hook for managing authentication with NextAuth session synchronization.
 * 
 * This hook handles:
 * - Session synchronization with NextAuth (automatic via useEffect)
 * - State management (local + NextAuth)
 * - Loading and error handling
 * - Authentication operations (sign in, sign out, refresh)
 * 
 * The provider only manages basic state, while this hook handles all business logic.
 * 
 * Session synchronization happens automatically when NextAuth session changes.
 * All authentication operations are handled through this hook's methods.
 * 
 * @example
 * ```tsx
 * // Basic usage - check authentication status
 * function MyComponent() {
 *   const { user, isAuthenticated, isLoading } = useAuth();
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!isAuthenticated) return <div>Please sign in</div>;
 *   return <div>Welcome, {user?.name}</div>;
 * }
 * 
 * // Sign in/out operations
 * function AuthButtons() {
 *   const { signIn, signOut, isAuthenticated, isLoading } = useAuth();
 *   
 *   return (
 *     <>
 *       {!isAuthenticated ? (
 *         <button onClick={signIn} disabled={isLoading}>
 *           Sign In
 *         </button>
 *       ) : (
 *         <button onClick={signOut} disabled={isLoading}>
 *           Sign Out
 *         </button>
 *       )}
 *     </>
 *   );
 * }
 * 
 * // Manual session refresh
 * function RefreshButton() {
 *   const { refreshSession, isLoading } = useAuth();
 *   return (
 *     <button onClick={refreshSession} disabled={isLoading}>
 *       Refresh Session
 *     </button>
 *   );
 * }
 * 
 * // Handle errors
 * function AuthComponent() {
 *   const { error, signIn } = useAuth();
 *   
 *   return (
 *     <>
 *       {error && <div>Error: {error.message}</div>}
 *       <button onClick={signIn}>Sign In</button>
 *     </>
 *   );
 * }
 * ```
 * 
 * @throws Error if used outside AuthProvider
 */
"use client";

import { useAuthContext } from "@/contexts/auth-context";
import { AuthUser } from "@/models/auth";
import { authService } from "@/services/auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";

export function useAuth() {
  const { data: session, status, update: updateSession } = useSession();
  
  const { 
    user, 
    isLoading: contextLoading,
    error,
    _setUser,
    _setLoading,
    _setError,
  } = useAuthContext();

  /**
   * Sync NextAuth session with context state
   * Called automatically when session or status changes
   * This ensures the context state stays in sync with NextAuth
   */
  useEffect(() => {
    if (status === "loading") {
      _setLoading(true);
      return;
    }

    _setLoading(false);
    _setError(null);

    if (session?.user) {
      const authUser: AuthUser = {
        uid: session.user.id,
        email: session.user.email || null,
        name: session.user.name || null,
        image: session.user.image || null,
      };
      _setUser(authUser);
    } else {
      _setUser(null);
    }
  }, [session, status, _setUser, _setLoading, _setError]);

  /**
   * Sign in with Google
   * Uses authService to handle the authentication flow
   * Session will be updated automatically via useEffect when NextAuth completes
   */
  const signIn = useCallback(async () => {
    _setLoading(true);
    _setError(null);

    try {
      await authService.signInWithGoogle();
      // Session will be updated automatically via useEffect
    } catch (err) {
      console.error("Error signing in:", err);
      _setError(err instanceof Error ? err : new Error("Failed to sign in"));
      _setLoading(false);
    }
  }, [_setLoading, _setError]);

  /**
   * Sign out current user
   * Uses authService to handle the sign out flow
   * Session will be updated automatically via useEffect when NextAuth completes
   */
  const signOut = useCallback(async () => {
    _setLoading(true);
    _setError(null);

    try {
      // Sign out from NextAuth
      await authService.signOut();
      
      // Session will be updated automatically via useEffect
      _setUser(null);

      // Clear local storage
      localStorage.clear();

      // Clear session storage
      sessionStorage.clear();
    } catch (err) {
      console.error("Error signing out:", err);
      _setError(err instanceof Error ? err : new Error("Failed to sign out"));
      _setLoading(false);
    }
  }, [_setUser, _setLoading, _setError]);

  /**
   * Refresh the current session
   * Manually triggers a session update from NextAuth
   * Session will be updated automatically via useEffect when NextAuth completes
   */
  const refreshSession = useCallback(async () => {
    _setLoading(true);
    _setError(null);

    try {
      await updateSession();
      // Session will be updated automatically via useEffect
    } catch (err) {
      console.error("Error refreshing session:", err);
      _setError(err instanceof Error ? err : new Error("Failed to refresh session"));
      _setLoading(false);
    }
  }, [updateSession, _setLoading, _setError]);

  return {
    // State
    user,
    isAuthenticated: !!user,
    isLoading: status === "loading" || contextLoading,
    error,
    
    // Operations
    signIn,
    signOut,
    refreshSession,
  };
}

