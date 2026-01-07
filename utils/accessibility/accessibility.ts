/**
 * Accessibility Utilities - MindEase
 * Helper functions for cognitive accessibility
 */

import { UserPreferences } from "@/models/UserPreferences";

/**
 * Default accessibility settings
 */
export const DEFAULT_ACCESSIBILITY_SETTINGS: UserPreferences = {
  contrast: "normal",
  spacing: "normal",
  fontSize: "normal",
  animations: true,
  focusMode: false,
  textDetail: "detailed",
};

/**
 * Apply cognitive accessibility settings to document
 * 
 * Applies settings to both document.documentElement (for contrast, spacing, fontSize, animations)
 * and document.body (for focusMode).
 * 
 * @param settings - Partial or full UserPreferences object
 */
export function applyAccessibilitySettings(settings: {
  contrast?: UserPreferences["contrast"];
  spacing?: UserPreferences["spacing"];
  fontSize?: UserPreferences["fontSize"];
  animations?: boolean;
  focusMode?: boolean;
  textDetail?: UserPreferences["textDetail"];
}) {
  if (typeof window === "undefined") {
    return;
  }

  const root = document.documentElement;

  // Apply contrast setting
  if (settings.contrast !== undefined) {
    root.setAttribute("data-contrast", settings.contrast);
  }

  // Apply spacing setting
  if (settings.spacing !== undefined) {
    root.setAttribute("data-spacing", settings.spacing);
  }

  // Apply font size setting
  if (settings.fontSize !== undefined) {
    root.setAttribute("data-font-size", settings.fontSize);
  }

  // Apply animations setting
  if (settings.animations !== undefined) {
    if (settings.animations) {
      root.removeAttribute("data-reduce-motion");
    } else {
      root.setAttribute("data-reduce-motion", "true");
    }
  }

  // Apply text detail setting
  if (settings.textDetail !== undefined) {
    root.setAttribute("data-text-detail", settings.textDetail);
  }

  // Apply focus mode setting (on body, not root)
  if (settings.focusMode !== undefined) {
    if (settings.focusMode) {
      document.body.setAttribute("data-focus-mode", "true");
    } else {
      document.body.removeAttribute("data-focus-mode");
    }
  }
}

/**
 * Read current accessibility settings from DOM
 * 
 * Reads all accessibility attributes from document.documentElement and document.body
 * and returns a complete UserPreferences object.
 * 
 * @returns UserPreferences object with current DOM state
 */
export function readAccessibilitySettingsFromDOM(): UserPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }

  const root = document.documentElement;

  return {
    contrast: (root.getAttribute("data-contrast") as UserPreferences["contrast"]) || DEFAULT_ACCESSIBILITY_SETTINGS.contrast,
    spacing: (root.getAttribute("data-spacing") as UserPreferences["spacing"]) || DEFAULT_ACCESSIBILITY_SETTINGS.spacing,
    fontSize: (root.getAttribute("data-font-size") as UserPreferences["fontSize"]) || DEFAULT_ACCESSIBILITY_SETTINGS.fontSize,
    animations: !root.hasAttribute("data-reduce-motion"),
    focusMode: document.body.hasAttribute("data-focus-mode"),
    textDetail: (root.getAttribute("data-text-detail") as UserPreferences["textDetail"]) || DEFAULT_ACCESSIBILITY_SETTINGS.textDetail,
  };
}

/**
 * Get the list of DOM attributes that should be observed for accessibility changes
 * 
 * Used by MutationObserver to watch for external changes to accessibility settings.
 * 
 * @returns Object with root and body attribute filters
 */
export function getAccessibilityObserverConfig() {
  return {
    rootAttributes: ["data-contrast", "data-spacing", "data-font-size", "data-reduce-motion", "data-text-detail"] as const,
    bodyAttributes: ["data-focus-mode"] as const,
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

