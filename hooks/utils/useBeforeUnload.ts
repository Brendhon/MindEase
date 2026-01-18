/**
 * useBeforeUnload Hook - MindEase
 * Manages browser beforeunload event to prevent navigation when needed
 *
 * This hook adds a confirmation dialog when the user tries to leave the page
 * while certain conditions are met (e.g., timer is running).
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const shouldBlock = timerState === "running";
 *   useBeforeUnload(shouldBlock);
 *
 *   return <div>...</div>;
 * }
 * ```
 */

'use client';

import { useEffect } from 'react';

/**
 * Hook to prevent navigation when a condition is met
 *
 * @param enabled - Whether to block navigation (show confirmation dialog)
 */
export function useBeforeUnload(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    /**
     * Handler for beforeunload event
     * Modern browsers ignore the return value and show a generic message,
     * but we still need to call preventDefault() and set returnValue
     * to trigger the confirmation dialog.
     */
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled]);
}
