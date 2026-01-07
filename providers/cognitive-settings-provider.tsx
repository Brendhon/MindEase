"use client";

import { useState, useCallback, useEffect } from "react";
import { CognitiveSettingsContext } from "@/contexts/cognitive-settings-context";
import { UserPreferences } from "@/models/UserPreferences";
import {
  applyAccessibilitySettings,
  readAccessibilitySettingsFromDOM,
  getAccessibilityObserverConfig,
  DEFAULT_ACCESSIBILITY_SETTINGS,
} from "@/utils/accessibility/accessibility";

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
 * - Automatically applies settings to DOM when changed (unless isolated)
 * - Reads initial settings from DOM on mount (unless isolated)
 * - Watches for external DOM changes (for sync, unless isolated)
 * 
 * @example
 * ```tsx
 * // Normal usage - applies to global DOM
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
  // Initialize state: use initialSettings if provided, otherwise read from DOM
  const [settings, setSettings] = useState<UserPreferences>(() => {
    if (initialSettings) {
      return initialSettings;
    }

    // In isolated mode, don't read from DOM
    if (isolated) {
      return DEFAULT_ACCESSIBILITY_SETTINGS;
    }

    // In client-side, try to read from DOM
    if (typeof window !== "undefined") {
      return readAccessibilitySettingsFromDOM();
    }

    return DEFAULT_ACCESSIBILITY_SETTINGS;
  });

  // Apply settings to DOM whenever they change (skip if isolated)
  useEffect(() => {
    if (isolated || typeof window === "undefined") {
      return;
    }

    applyAccessibilitySettings({
      contrast: settings.contrast,
      spacing: settings.spacing,
      fontSize: settings.fontSize,
      animations: settings.animations,
      focusMode: settings.focusMode,
    });
  }, [settings, isolated]);

  // Watch for external changes to DOM attributes (for sync with other sources)
  // Skip if isolated mode
  useEffect(() => {
    if (isolated || typeof window === "undefined") {
      return;
    }

    const updateFromDOM = () => {
      const domSettings = readAccessibilitySettingsFromDOM();
      setSettings((prev) => {
        // Only update if something actually changed
        const hasChanges = Object.keys(domSettings).some(
          (key) => prev[key as keyof UserPreferences] !== domSettings[key as keyof UserPreferences]
        );

        return hasChanges ? domSettings : prev;
      });
    };

    // Initial read (in case DOM was modified before this component mounted)
    updateFromDOM();

    // Watch for changes
    const observer = new MutationObserver(() => {
      updateFromDOM();
    });

    const { rootAttributes, bodyAttributes } = getAccessibilityObserverConfig();

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [...rootAttributes],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [...bodyAttributes],
    });

    return () => {
      observer.disconnect();
    };
  }, [isolated]);

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

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
  }, []);

  return (
    <CognitiveSettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </CognitiveSettingsContext.Provider>
  );
}

