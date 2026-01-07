"use client";

import { useState, useCallback, useEffect } from "react";
import { CognitiveSettingsContext } from "@/contexts/cognitive-settings-context";
import { UserPreferences } from "@/models/UserPreferences";
import { applyAccessibilitySettings } from "@/utils/accessibility/accessibility";

interface CognitiveSettingsProviderProps {
  children: React.ReactNode;
  initialSettings?: UserPreferences;
}

const defaultSettings: UserPreferences = {
  contrast: "normal",
  spacing: "normal",
  fontSize: "normal",
  animations: true,
  focusMode: false,
};

/**
 * Read current accessibility settings from DOM
 */
function readSettingsFromDOM(): UserPreferences {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  const root = document.documentElement;

  return {
    contrast: (root.getAttribute("data-contrast") as UserPreferences["contrast"]) || "normal",
    spacing: (root.getAttribute("data-spacing") as UserPreferences["spacing"]) || "normal",
    fontSize: (root.getAttribute("data-font-size") as UserPreferences["fontSize"]) || "normal",
    animations: !root.hasAttribute("data-reduce-motion"),
    focusMode: document.body.hasAttribute("data-focus-mode"),
  };
}

/**
 * Cognitive Settings Provider - MindEase
 * 
 * Provides global cognitive accessibility settings state to all components.
 * 
 * Features:
 * - Manages user preferences state globally
 * - Automatically applies settings to DOM when changed
 * - Reads initial settings from DOM on mount
 * - Watches for external DOM changes (for sync)
 * 
 * @example
 * ```tsx
 * <CognitiveSettingsProvider>
 *   <App />
 * </CognitiveSettingsProvider>
 * ```
 */
export function CognitiveSettingsProvider({
  children,
  initialSettings,
}: CognitiveSettingsProviderProps) {
  // Initialize state: use initialSettings if provided, otherwise read from DOM
  const [settings, setSettings] = useState<UserPreferences>(() => {
    if (initialSettings) {
      return initialSettings;
    }

    // In client-side, try to read from DOM
    if (typeof window !== "undefined") {
      return readSettingsFromDOM();
    }

    return defaultSettings;
  });

  // Apply settings to DOM whenever they change
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    applyAccessibilitySettings({
      contrast: settings.contrast,
      spacing: settings.spacing,
      fontSize: settings.fontSize,
      animations: settings.animations,
    });

    // Handle focus mode separately (applies to body, not root)
    if (settings.focusMode) {
      document.body.setAttribute("data-focus-mode", "true");
    } else {
      document.body.removeAttribute("data-focus-mode");
    }
  }, [settings]);

  // Watch for external changes to DOM attributes (for sync with other sources)
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateFromDOM = () => {
      const domSettings = readSettingsFromDOM();
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

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-contrast", "data-spacing", "data-font-size", "data-reduce-motion"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-focus-mode"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

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
    setSettings(defaultSettings);
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

