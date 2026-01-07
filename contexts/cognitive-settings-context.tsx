import { UserPreferences } from "@/models/UserPreferences";
import { createContext, useContext } from "react";

/**
 * Cognitive Settings Context - MindEase
 * 
 * Context for global cognitive accessibility settings state.
 * Provides read and write access to user preferences.
 */
interface CognitiveSettingsContextValue {
  settings: UserPreferences;
  updateSetting: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  updateSettings: (newSettings: Partial<UserPreferences>) => void;
  resetSettings: () => void;
}

export const CognitiveSettingsContext = createContext<
  CognitiveSettingsContextValue | undefined
>(undefined);

/**
 * Hook to access cognitive settings context
 * 
 * @throws Error if used outside CognitiveSettingsProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { settings } = useCognitiveSettingsContext();
 *   return <div>Contrast: {settings.contrast}</div>;
 * }
 * ```
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

