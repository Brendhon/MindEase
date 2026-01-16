import { AuthUser } from "@/models/auth";
import { createContext, useContext } from "react";

/**
 * Auth Context - MindEase
 * 
 * Context for global authentication state.
 * 
 * This context provides ONLY basic state:
 * - User state
 * - Loading and error states
 * - Internal setters for useAuth hook
 * 
 * All business logic (authentication operations, session management, error handling)
 * is handled by the useAuth hook. Components should use useAuth(), not useAuthContext().
 */
interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
  
  // Internal setters - only used by useAuth hook
  _setUser: (user: AuthUser | null | ((prev: AuthUser | null) => AuthUser | null)) => void;
  _setLoading: (loading: boolean) => void;
  _setError: (error: Error | null) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Hook to access auth context
 * 
 * ⚠️ **Note**: This hook is for internal use by useAuth hook only.
 * Components should use useAuth() instead, which provides all business logic.
 * 
 * @throws Error if used outside AuthProvider
 * 
 * @internal
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      "useAuthContext must be used within AuthProvider"
    );
  }
  
  return context;
}
