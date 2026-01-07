"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { CognitiveSettingsContext } from "@/contexts/cognitive-settings-context";
import { UserPreferences, DEFAULT_ACCESSIBILITY_SETTINGS } from "@/models/UserPreferences";
import { userPreferencesService } from "@/services/user-preferences";

interface CognitiveSettingsProviderProps {
  children: React.ReactNode;
  initialSettings?: UserPreferences;
  /**
   * When true, this provider will not apply settings to the global DOM.
   * Useful for isolated scenarios like Storybook stories where multiple
   * providers need to coexist without interfering with each other.
   * @default false
   */
  isolated?: boolean;
}

/**
 * Cognitive Settings Provider - MindEase
 * 
 * Provides global cognitive accessibility settings state to all components.
 * 
 * Features:
 * - Manages user preferences state globally
 * - Automatically loads preferences from Firestore for authenticated users
 * - Debounced auto-save to Firestore on changes
 * - Isolated mode for Storybook/testing (no Firestore integration)
 * 
 * @example
 * ```tsx
 * // Normal usage - syncs with Firestore
 * <CognitiveSettingsProvider>
 *   <App />
 * </CognitiveSettingsProvider>
 * 
 * // Isolated usage - for stories/tests with multiple providers
 * <CognitiveSettingsProvider isolated={true} initialSettings={{ contrast: 'high' }}>
 *   <Component />
 * </CognitiveSettingsProvider>
 * ```
 */
export function CognitiveSettingsProvider({
  children,
  initialSettings,
  isolated = false,
}: CognitiveSettingsProviderProps) {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<UserPreferences>(
    initialSettings || DEFAULT_ACCESSIBILITY_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Debounce timer ref for auto-save
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  // Load preferences from Firestore on mount (for authenticated users)
  useEffect(() => {
    if (isolated || status !== "authenticated" || !session?.user?.id) {
      isInitialLoadRef.current = false;
      return;
    }

    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userPrefs = await userPreferencesService.getUserPreferences(session.user.id);
        setSettings(userPrefs);
      } catch (err) {
        console.error("Error loading user preferences:", err);
        setError(err instanceof Error ? err : new Error("Failed to load preferences"));
        // Keep using default settings on error
      } finally {
        setIsLoading(false);
        isInitialLoadRef.current = false;
      }
    };

    loadPreferences();
  }, [session?.user?.id, status, isolated]);

  // Debounced save to Firestore whenever settings change
  useEffect(() => {
    // Skip save on initial load or in isolated mode
    if (isInitialLoadRef.current || isolated || status !== "authenticated" || !session?.user?.id) {
      return;
    }

    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Set new debounced save
    saveTimerRef.current = setTimeout(async () => {
      try {
        setError(null);
        await userPreferencesService.updateUserPreferences(session.user.id, settings);
      } catch (err) {
        console.error("Error saving user preferences:", err);
        setError(err instanceof Error ? err : new Error("Failed to save preferences"));
      }
    }, 500); // 500ms debounce

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [settings, session?.user?.id, status, isolated]);

  const updateSetting = useCallback(
    <K extends keyof UserPreferences>(
      key: K,
      value: UserPreferences[K]
    ) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateSettings = useCallback((newSettings: Partial<UserPreferences>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const resetSettings = useCallback(async () => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
    
    // Also reset in Firestore if authenticated and not isolated
    if (!isolated && status === "authenticated" && session?.user?.id) {
      try {
        await userPreferencesService.resetUserPreferences(session.user.id);
      } catch (err) {
        console.error("Error resetting user preferences:", err);
        setError(err instanceof Error ? err : new Error("Failed to reset preferences"));
      }
    }
  }, [session?.user?.id, status, isolated]);

  return (
    <CognitiveSettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
        isLoading,
        error,
      }}
    >
      {children}
    </CognitiveSettingsContext.Provider>
  );
}

