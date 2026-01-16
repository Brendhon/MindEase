import { useCallback } from "react";
import { useCognitiveSettingsContext } from "@/contexts/cognitive-settings-context";
import { useAuth } from "@/hooks/useAuth";
import { userPreferencesService } from "@/services/user-preferences";
import { UserPreferences, DEFAULT_ACCESSIBILITY_SETTINGS } from "@/models/UserPreferences";

/**
 * useCognitiveSettings Hook - MindEase
 * 
 * Centralized hook for managing cognitive accessibility settings with Firestore synchronization.
 * 
 * This hook handles:
 * - CRUD operations with Firestore
 * - State synchronization (local + remote)
 * - Loading and error handling
 * 
 * For Tailwind classes generation, use `useAccessibilityClasses` hook instead.
 * For text detail helpers, use `useTextDetail` hook instead.
 * This separation reduces unnecessary re-renders and improves performance.
 * 
 * The provider only manages basic state, while this hook handles all business logic.
 * 
 * @example
 * ```tsx
 * // Basic usage - update setting (syncs with Firestore)
 * function MyComponent() {
 *   const { settings, updateSetting } = useCognitiveSettings();
 *   return (
 *     <button onClick={() => updateSetting("contrast", "high")}>
 *       High Contrast
 *     </button>
 *   );
 * }
 * 
 * // Load settings on mount
 * function SettingsPage() {
 *   const { loadSettings, isLoading } = useCognitiveSettings();
 *   
 *   useEffect(() => {
 *     loadSettings();
 *   }, [loadSettings]);
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   return <div>Settings loaded</div>;
 * }
 * 
 * // For classes, use useAccessibilityClasses instead
 * function StyledComponent() {
 *   const { spacingClasses } = useAccessibilityClasses();
 *   return <div className={spacingClasses.padding}>Content</div>;
 * }
 * 
 * // For text detail, use useTextDetail instead
 * function TextComponent() {
 *   const { getText } = useTextDetail();
 *   return <p>{getText("welcome")}</p>;
 * }
 * ```
 * 
 * @throws Error if used outside CognitiveSettingsProvider
 */
export function useCognitiveSettings() {
  const { 
    settings, 
    isLoading,
    error,
    _setSettings,
    _setLoading,
    _setError,
  } = useCognitiveSettingsContext();
  
  const { user } = useAuth();

  /**
   * Load settings from Firestore
   * Called manually when needed (e.g., on component mount)
   */
  const loadSettings = useCallback(async () => {
    if (!user?.uid) return;

    _setLoading(true);
    _setError(null);

    try {
      const userPrefs = await userPreferencesService.getUserPreferences(user.uid);
      _setSettings(userPrefs);
    } catch (err) {
      console.error("Error loading user preferences:", err);
      _setError(err instanceof Error ? err : new Error("Failed to load preferences"));
    } finally {
      _setLoading(false);
    }
  }, [user?.uid, _setSettings, _setLoading, _setError]);

  /**
   * Update a single setting
   * Automatically syncs with Firestore and updates local state
   */
  const updateSetting = useCallback(
    async <K extends keyof UserPreferences>(
      key: K,
      value: UserPreferences[K]
    ) => {
      // Optimistic update
      _setSettings((prev) => ({ ...prev, [key]: value }));

      // Sync with Firestore if authenticated
      if (!user?.uid) return;

      _setLoading(true);
      _setError(null);

      try {
        const updated = await userPreferencesService.updateUserPreferences(user.uid, {
          [key]: value,
        });
        _setSettings(updated);
      } catch (err) {
        console.error("Error updating user preferences:", err);
        _setError(err instanceof Error ? err : new Error("Failed to update preferences"));
        // Revert optimistic update on error
        _setSettings((prev) => {
          const reverted = { ...prev };
          // Restore previous value - we need to get it from the current state before update
          // For simplicity, we'll reload from Firestore on error
          return prev;
        });
        // Reload from Firestore to get correct state
        await loadSettings();
      } finally {
        _setLoading(false);
      }
    },
    [user?.uid, _setSettings, _setLoading, _setError, loadSettings]
  );

  /**
   * Update multiple settings at once
   * Automatically syncs with Firestore and updates local state
   */
  const updateSettings = useCallback(
    async (newSettings: Partial<UserPreferences>) => {
      // Optimistic update
      _setSettings((prev) => ({ ...prev, ...newSettings }));

      // Sync with Firestore if authenticated
      if (!user?.uid) return;

      _setLoading(true);
      _setError(null);

      try {
        const updated = await userPreferencesService.updateUserPreferences(user.uid, newSettings);
        _setSettings(updated);
      } catch (err) {
        console.error("Error updating user preferences:", err);
        _setError(err instanceof Error ? err : new Error("Failed to update preferences"));
        // Reload from Firestore to get correct state
        await loadSettings();
      } finally {
        _setLoading(false);
      }
    },
    [user?.uid, _setSettings, _setLoading, _setError, loadSettings]
  );

  /**
   * Reset settings to defaults
   * Automatically syncs with Firestore and updates local state
   */
  const resetSettings = useCallback(async () => {
    // Optimistic update
    _setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);

    // Sync with Firestore if authenticated
    if (!user?.uid) return;

    _setLoading(true);
    _setError(null);

    try {
      const reset = await userPreferencesService.resetUserPreferences(user.uid);
      _setSettings(reset);
    } catch (err) {
      console.error("Error resetting user preferences:", err);
      _setError(err instanceof Error ? err : new Error("Failed to reset preferences"));
      // Reload from Firestore to get correct state
      await loadSettings();
    } finally {
      _setLoading(false);
    }
  }, [user?.uid, _setSettings, _setLoading, _setError, loadSettings]);

  return {
    // State
    settings,
    isLoading,
    error,
    
    // Operations
    loadSettings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
}
