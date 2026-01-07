/**
 * Accessibility Utilities - MindEase
 * Helper functions for cognitive accessibility
 * 
 * NOTE: This file has been simplified. Most accessibility functionality
 * has been moved to:
 * - @/utils/accessibility/tailwind-classes.ts (for styling)
 * - @/utils/accessibility/content.ts (for text content)
 * - @/models/UserPreferences.ts (for default settings)
 */

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

