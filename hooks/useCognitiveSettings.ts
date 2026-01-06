import { useState, useCallback } from "react";
import { UserPreferences } from "@/models/UserPreferences";

/**
 * useCognitiveSettings Hook - MindEase
 * Hook for managing cognitive accessibility settings
 */
export function useCognitiveSettings(initialSettings?: UserPreferences) {
  const [settings, setSettings] = useState<UserPreferences>(
    initialSettings || {
      contrast: "normal",
      spacing: "normal",
      fontSize: "normal",
      animations: true,
      focusMode: false,
    }
  );

  const updateSetting = useCallback(
    <K extends keyof UserPreferences>(
      key: K,
      value: UserPreferences[K]
    ) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings({
      contrast: "normal",
      spacing: "normal",
      fontSize: "normal",
      animations: true,
      focusMode: false,
    });
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
    setSettings,
  };
}

