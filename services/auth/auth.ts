/**
 * Auth Service - MindEase
 * Authentication service using NextAuth
 */
import { signIn, signOut, getSession } from "next-auth/react";
import { Session } from "next-auth";

/**
 * Auth Service interface
 */
export interface AuthService {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<{ uid: string; email: string | null } | null>;
  getSession: () => Promise<Session | null>;
}

/**
 * Convert NextAuth Session to our user format
 */
const convertSession = (session: Session | null): { uid: string; email: string | null } | null => {
  if (!session?.user) return null;
  return {
    uid: session.user.id,
    email: session.user.email || null,
  };
};

/**
 * Auth Service implementation using NextAuth
 */
export const authService: AuthService = {
  /**
   * Sign in with Google using NextAuth
   */
  signInWithGoogle: async (): Promise<void> => {
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  },

  /**
   * Sign out current user
   */
  signOut: async (): Promise<void> => {
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<{ uid: string; email: string | null } | null> => {
    try {
      const session = await getSession();
      return convertSession(session);
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  /**
   * Get current session (includes full session data)
   */
  getSession: async (): Promise<Session | null> => {
    try {
      return await getSession();
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  },
};

