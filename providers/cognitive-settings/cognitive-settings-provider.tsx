"use client";

import { useState, useCallback } from "react";
import { CognitiveSettingsContext } from "@/contexts/cognitive-settings";
import { UserPreferences, DEFAULT_ACCESSIBILITY_SETTINGS } from "@/models/user-preferences";

interface CognitiveSettingsProviderProps {
  children: React.ReactNode;
  initialSettings?: UserPreferences;
}

/**
 * Cognitive Settings Provider - MindEase
 * 
 * Provides cognitive accessibility settings context to children components.
 * 
 * This provider manages ONLY basic state (settings, loading, error).
 * All business logic is handled by the useCognitiveSettings hook.
 * 
 * @example
 * ```tsx
 * // Normal usage
 * <CognitiveSettingsProvider>
 *   <App />
 * </CognitiveSettingsProvider>
 * 
 * // Isolated usage - for stories/tests with multiple providers
 * <CognitiveSettingsProvider initialSettings={{ contrast: 'high' }}>
 *   <Component />
 * </CognitiveSettingsProvider>
 * ```
 */
export function CognitiveSettingsProvider({
  children,
  initialSettings,
}: CognitiveSettingsProviderProps) {
  const [settings, setSettings] = useState<UserPreferences>(
    initialSettings || DEFAULT_ACCESSIBILITY_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Internal setters for useCognitiveSettings hook to use
  const setSettingsState = useCallback(
    (newSettings: UserPreferences | ((prev: UserPreferences) => UserPreferences)) => 
      setSettings(newSettings),
    []
  );

  const setLoadingState = useCallback((isLoading: boolean) => setIsLoading(isLoading), []);

  const setErrorState = useCallback((err: Error | null) => setError(err), []);

  return (
    <CognitiveSettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        _setSettings: setSettingsState,
        _setLoading: setLoadingState,
        _setError: setErrorState,
      }}
    >
      {children}
    </CognitiveSettingsContext.Provider>
  );
}

