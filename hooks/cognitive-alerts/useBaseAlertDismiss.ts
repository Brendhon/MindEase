import { useCallback } from "react";

/**
 * Hook to provide dismiss functionality for cognitive alerts.
 * 
 * Creates a memoized dismiss function that:
 * - Hides the alert (sets isVisible to false)
 * - Marks alert as dismissed (sets isDismissed to true)
 * - Records dismiss timestamp (sets dismissedAt to current time)
 * 
 * This logic is shared across all cognitive alerts.
 * 
 * @param setIsVisible - Setter for alert visibility
 * @param setIsDismissed - Setter for dismissed state
 * @param setDismissedAt - Setter for dismissed timestamp
 * @returns Memoized dismiss function
 * 
 * @example
 * ```typescript
 * const { _setIsVisible, _setIsDismissed, _setDismissedAt } = useAlertContext();
 * const dismissAlert = useBaseAlertDismiss(_setIsVisible, _setIsDismissed, _setDismissedAt);
 * ```
 */
export function useBaseAlertDismiss(
  setIsVisible: (visible: boolean) => void,
  setIsDismissed: (dismissed: boolean) => void,
  setDismissedAt: (timestamp: number | null) => void
) {
  const dismiss = useCallback(() => {
    setIsVisible(false);
    setIsDismissed(true);
    setDismissedAt(Date.now()); // Store current timestamp
  }, [setIsVisible, setIsDismissed, setDismissedAt]);

  return dismiss;
}
