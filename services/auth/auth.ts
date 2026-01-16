/**
 * Auth Service - MindEase
 * Authentication service using NextAuth
 */
import { signIn, signOut, getSession } from "next-auth/react";
import { Session } from "next-auth";
import { tasksService } from "../tasks";
import { userPreferencesService } from "../user-preferences";
import { AuthUser } from "@/models/Auth";

/**
 * Auth Service interface
 */
export interface AuthService {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<AuthUser | null>;
  getSession: () => Promise<Session | null>;
  deleteAccount: (userId: string) => Promise<void>;
}

/**
 * Convert NextAuth Session to our user format
 */
export const convertSession = (session: Session | null): AuthUser | null => {
  if (!session?.user) return null;
  return {
    uid: session.user.id,
    email: session.user.email || null,
    name: session.user.name || null,
    image: session.user.image || null,
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
  getCurrentUser: async (): Promise<AuthUser | null> => {
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

  /**
   * Delete user account and all associated data
   * 1. Delete all user tasks
   * 2. Delete user preferences
   * 3. Sign out the user
   */
  deleteAccount: async (userId: string): Promise<void> => {
    try {
      // Delete all tasks
      await tasksService.deleteAllTasks(userId);
      
      // Delete user preferences
      await userPreferencesService.deleteUserPreferences(userId);
      
      // Sign out the user
      await authService.signOut();
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  },
};

