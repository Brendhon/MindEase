import { UserPreferences } from "@/models/user-preferences";
import { createContext, useContext } from "react";

/**
 * Cognitive Settings Context - MindEase
 * 
 * Context for global cognitive accessibility settings state.
 * 
 * This context provides ONLY basic state:
 * - Settings state
 * - Loading and error states
 * - Internal setters for useCognitiveSettings hook
 * 
 * All business logic (CRUD operations, Firestore sync, loading, error handling)
 * is handled by the useCognitiveSettings hook. Components should use useCognitiveSettings(), not useCognitiveSettingsContext().
 */
interface CognitiveSettingsContextValue {
  settings: UserPreferences;
  isLoading: boolean;
  error: Error | null;
  
  // Internal setters - only used by useCognitiveSettings hook
  _setSettings: (settings: UserPreferences | ((prev: UserPreferences) => UserPreferences)) => void;
  _setLoading: (loading: boolean) => void;
  _setError: (error: Error | null) => void;
}

export const CognitiveSettingsContext = createContext<
  CognitiveSettingsContextValue | undefined
>(undefined);

/**
 * Hook to access cognitive settings context
 * 
 * ⚠️ **Note**: This hook is for internal use by useCognitiveSettings hook only.
 * Components should use useCognitiveSettings() instead, which provides all business logic.
 * 
 * @throws Error if used outside CognitiveSettingsProvider
 * 
 * @internal
 */
export function useCognitiveSettingsContext(): CognitiveSettingsContextValue {
  const context = useContext(CognitiveSettingsContext);
  
  if (!context) {
    throw new Error(
      "useCognitiveSettingsContext must be used within CognitiveSettingsProvider"
    );
  }
  
  return context;
}

