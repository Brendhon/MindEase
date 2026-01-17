"use client";

import { useCallback, useState } from "react";

/**
 * Common alert state and setters returned by useCommonAlertState
 */
export interface CommonAlertState {
  isVisible: boolean;
  isDismissed: boolean;
  dismissedAt: number | null;
  setIsVisible: (visible: boolean) => void;
  setIsDismissed: (dismissed: boolean) => void;
  setDismissedAt: (timestamp: number | null) => void;
}

/**
 * Hook to manage common alert state (visibility, dismissed, dismissedAt).
 * 
 * This hook encapsulates the common state management pattern used by all cognitive alert providers.
 * Reduces duplication by providing memoized setters for the three common fields.
 * 
 * @returns Common alert state and setters
 * 
 * @example
 * ```typescript
 * function AlertProvider({ children }) {
 *   const commonState = useCommonAlertState();
 *   // ... manage additional state
 *   // ... build context value with commonState
 * }
 * ```
 */
export function useCommonAlertState(): CommonAlertState {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  const setIsVisibleState = useCallback(
    (visible: boolean) => setIsVisible(visible),
    []
  );

  const setIsDismissedState = useCallback(
    (dismissed: boolean) => setIsDismissed(dismissed),
    []
  );

  const setDismissedAtState = useCallback(
    (timestamp: number | null) => setDismissedAt(timestamp),
    []
  );

  return {
    isVisible,
    isDismissed,
    dismissedAt,
    setIsVisible: setIsVisibleState,
    setIsDismissed: setIsDismissedState,
    setDismissedAt: setDismissedAtState,
  };
}
