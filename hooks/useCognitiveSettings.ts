import { useState, useCallback, useEffect } from "react";
import { UserPreferences } from "@/models/UserPreferences";
import { applyAccessibilitySettings } from "@/utils/accessibility/accessibility";

/**
 * useCognitiveSettings Hook - MindEase
 * 
 * Hook for managing cognitive accessibility settings with automatic DOM synchronization.
 * 
 * Features:
 * - Automatically applies settings to DOM via data-* attributes
 * - Reads current settings from DOM on initialization
 * - Watches for external changes to accessibility attributes
 * - Supports both read-only and write modes
 * 
 * @param initialSettings - Optional initial settings (if not provided, reads from DOM)
 * @param options - Configuration options
 * @param options.autoApply - Automatically apply settings to DOM when changed (default: true)
 * @param options.readOnly - Read-only mode, only observes DOM changes (default: false)
 */
export interface UseCognitiveSettingsOptions {
  autoApply?: boolean;
  readOnly?: boolean;
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

export function useCognitiveSettings(
  initialSettings?: UserPreferences,
  options: UseCognitiveSettingsOptions = {}
) {
  const { autoApply = true, readOnly = false } = options;

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

  // Apply settings to DOM whenever they change (if autoApply is enabled)
  useEffect(() => {
    if (!autoApply || typeof window === "undefined") {
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
  }, [settings, autoApply]);

  // Watch for external changes to DOM attributes (useful for read-only mode or sync)
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

    // Initial read
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
      if (readOnly) {
        console.warn("useCognitiveSettings: Attempted to update setting in read-only mode");
        return;
      }

      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [readOnly]
  );

  const resetSettings = useCallback(() => {
    if (readOnly) {
      console.warn("useCognitiveSettings: Attempted to reset settings in read-only mode");
      return;
    }

    setSettings(defaultSettings);
  }, [readOnly]);

  const updateSettings = useCallback(
    (newSettings: Partial<UserPreferences>) => {
      if (readOnly) {
        console.warn("useCognitiveSettings: Attempted to update settings in read-only mode");
        return;
      }

      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    [readOnly]
  );

  // Return type varies based on readOnly mode
  if (readOnly) {
    return {
      settings,
      // Read-only mode: no setters available
    } as const;
  }

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    setSettings,
  };
}

