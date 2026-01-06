/**
 * Accessibility Utilities - MindEase
 * Helper functions for cognitive accessibility
 */

/**
 * Apply cognitive accessibility settings to document
 */
export function applyAccessibilitySettings(settings: {
  contrast?: "normal" | "high" | "low";
  spacing?: "normal" | "compact" | "relaxed";
  fontSize?: "normal" | "small" | "large";
  animations?: boolean;
}) {
  const root = document.documentElement;

  if (settings.contrast) {
    root.setAttribute("data-contrast", settings.contrast);
  }

  if (settings.spacing) {
    root.setAttribute("data-spacing", settings.spacing);
  }

  if (settings.fontSize) {
    root.setAttribute("data-font-size", settings.fontSize);
  }

  if (settings.animations !== undefined) {
    if (settings.animations) {
      root.removeAttribute("data-reduce-motion");
    } else {
      root.setAttribute("data-reduce-motion", "true");
    }
  }
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

