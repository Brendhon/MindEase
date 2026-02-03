import { useCallback, useEffect } from 'react';
import { useCognitiveSettingsContext } from '@/contexts/cognitive-settings';
import { useAuth } from '@/hooks/auth';
import { userPreferencesService } from '@/services/user-preferences';
import {
  UserPreferences,
  DEFAULT_ACCESSIBILITY_SETTINGS,
} from '@/models/user-preferences';

/**
 * useCognitiveSettings Hook - MindEase
 *
 * Centralized hook for managing cognitive accessibility settings with Firestore synchronization.
 *
 * This hook handles:
 * - CRUD operations with Firestore
 * - Real-time sync when user is authenticated (web and mobile stay in sync)
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
  const { settings, isLoading, error, _setSettings, _setLoading, _setError } =
    useCognitiveSettingsContext();

  const { user } = useAuth();

  /**
   * Revert local state from Firestore (used on write error only).
   * Not exposed; real-time subscription keeps state in sync otherwise.
   */
  const revertFromServer = useCallback(
    async (userId: string) => {
      _setLoading(true);
      _setError(null);
      try {
        const preferences =
          await userPreferencesService.getUserPreferences(userId);
        _setSettings(preferences);
      } catch (err) {
        console.error('Error loading user preferences:', err);
        _setError(
          err instanceof Error ? err : new Error('Failed to load preferences')
        );
        _setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
      } finally {
        _setLoading(false);
      }
    },
    [_setSettings, _setLoading, _setError]
  );

  /**
   * Subscribe to user preferences for real-time sync (web + mobile).
   * Cleanup on unmount or user change.
   */
  useEffect(() => {
    if (!user?.uid) {
      _setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
      return;
    }

    _setLoading(true);
    _setError(null);

    const unsubscribe = userPreferencesService.subscribeUserPreferences(
      user.uid,
      (preferences) => {
        _setSettings(preferences);
        _setLoading(false);
        _setError(null);
      },
      (err) => {
        _setError(err);
        _setLoading(false);
      }
    );

    return () => unsubscribe();
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
      _setSettings((prev) => ({ ...prev, [key]: value }));

      if (!user?.uid) return;

      try {
        await userPreferencesService.updateUserPreferences(user.uid, {
          [key]: value,
        });
      } catch (err) {
        console.error('Error updating user preferences:', err);
        _setError(
          err instanceof Error ? err : new Error('Failed to update preferences')
        );
        await revertFromServer(user.uid);
      }
    },
    [user?.uid, _setSettings, _setError, revertFromServer]
  );

  /**
   * Update multiple settings at once
   * Automatically syncs with Firestore and updates local state
   */
  const updateSettings = useCallback(
    async (newSettings: Partial<UserPreferences>) => {
      _setSettings((prev) => ({ ...prev, ...newSettings }));

      if (!user?.uid) return;

      try {
        await userPreferencesService.updateUserPreferences(
          user.uid,
          newSettings
        );
      } catch (err) {
        console.error('Error updating user preferences:', err);
        _setError(
          err instanceof Error ? err : new Error('Failed to update preferences')
        );
        await revertFromServer(user.uid);
      }
    },
    [user?.uid, _setSettings, _setError, revertFromServer]
  );

  /**
   * Reset settings to defaults
   * Automatically syncs with Firestore and updates local state
   */
  const resetSettings = useCallback(async () => {
    _setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);

    if (!user?.uid) return;

    try {
      await userPreferencesService.resetUserPreferences(user.uid);
    } catch (err) {
      console.error('Error resetting user preferences:', err);
      _setError(
        err instanceof Error ? err : new Error('Failed to reset preferences')
      );
      await revertFromServer(user.uid);
    }
  }, [user?.uid, _setSettings, _setError, revertFromServer]);

  return {
    // State
    settings,
    isLoading,
    error,

    // Operations
    updateSetting,
    updateSettings,
    resetSettings,
  };
}
