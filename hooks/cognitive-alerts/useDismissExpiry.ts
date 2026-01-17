import { useEffect } from "react";
import { COGNITIVE_ALERT_DISMISS_EXPIRY_MS } from "@/utils/cognitive-alerts";

/**
 * Hook to manage dismiss expiry for cognitive alerts.
 * 
 * Checks if a dismissed alert has expired (after 2 hours) and automatically
 * resets the dismissed state. This logic is shared across all cognitive alerts.
 * 
 * @param dismissedAt - Timestamp when alert was dismissed (null if not dismissed)
 * @param setIsDismissed - Setter for dismissed state
 * @param setDismissedAt - Setter for dismissed timestamp
 * 
 * @example
 * ```typescript
 * const { dismissedAt, _setIsDismissed, _setDismissedAt } = useAlertContext();
 * useDismissExpiry(dismissedAt, _setIsDismissed, _setDismissedAt);
 * ```
 */
export function useDismissExpiry(
  dismissedAt: number | null,
  setIsDismissed: (dismissed: boolean) => void,
  setDismissedAt: (timestamp: number | null) => void
) {
  useEffect(() => {
    if (dismissedAt === null) return;

    const checkExpiry = () => {
      const now = Date.now();
      const timeSinceDismiss = now - dismissedAt;

      if (timeSinceDismiss >= COGNITIVE_ALERT_DISMISS_EXPIRY_MS) {
        // Dismiss expired - reset dismissed state
        setIsDismissed(false);
        setDismissedAt(null);
      }
    };

    // Check immediately
    checkExpiry();

    // Check every minute to see if dismiss expired
    const intervalId = setInterval(checkExpiry, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, [dismissedAt, setIsDismissed, setDismissedAt]);
}
