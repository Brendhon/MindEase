import { useCallback, useEffect } from "react";
import { useProlongedNavigationAlertContext } from "@/contexts/prolonged-navigation-alert-context";
import {
  PROLONGED_NAVIGATION_THRESHOLD_MS,
  COGNITIVE_ALERT_DISMISS_EXPIRY_MS
} from "@/utils/cognitive-alerts";

/**
 * useProlongedNavigationAlert Hook - MindEase
 * 
 * Centralized hook for managing prolonged navigation alert state and business logic.
 * 
 * This hook handles:
 * - Tracking time since last user action (subtask completion or focus start)
 * - Detecting navigation without actions
 * - Managing alert visibility based on business rules
 * - Resetting timestamps when actions occur
 * 
 * The provider only manages basic state, while this hook handles all business logic.
 * 
 * @example
 * ```tsx
 * // Record user action
 * function TaskCard() {
 *   const { recordUserAction } = useProlongedNavigationAlert();
 *   
 *   const handleStartFocus = () => {
 *     recordUserAction();
 *     // ... other logic
 *   };
 * }
 * 
 * // Check alert visibility
 * function AlertsComponent() {
 *   const { isProlongedNavigationAlertVisible, dismissProlongedNavigationAlert } = useProlongedNavigationAlert();
 *   
 *   return (
 *     <Alert
 *       isVisible={isProlongedNavigationAlertVisible}
 *       onDismiss={dismissProlongedNavigationAlert}
 *     />
 *   );
 * }
 * ```
 * 
 * @throws Error if used outside ProlongedNavigationAlertProvider
 */
export function useProlongedNavigationAlert() {
  const {
    lastActionTimestamp,
    isProlongedNavigationAlertVisible,
    isProlongedNavigationAlertDismissed,
    dismissedAt,
    _setLastActionTimestamp,
    _setIsProlongedNavigationAlertVisible,
    _setIsProlongedNavigationAlertDismissed,
    _setDismissedAt,
  } = useProlongedNavigationAlertContext();

  // Initialize lastActionTimestamp on mount if not set
  useEffect(() => {
    if (lastActionTimestamp === null) {
      _setLastActionTimestamp(Date.now());
    }
  }, [lastActionTimestamp, _setLastActionTimestamp]);

  // Check if dismiss has expired (2 hours)
  useEffect(() => {
    if (dismissedAt === null) return;

    const checkExpiry = () => {
      const now = Date.now();
      const timeSinceDismiss = now - dismissedAt;

      if (timeSinceDismiss >= COGNITIVE_ALERT_DISMISS_EXPIRY_MS) {
        // Dismiss expired - reset dismissed state
        _setIsProlongedNavigationAlertDismissed(false);
        _setDismissedAt(null);
      }
    };

    // Check immediately
    checkExpiry();

    // Check every minute to see if dismiss expired
    const intervalId = setInterval(checkExpiry, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, [dismissedAt, _setIsProlongedNavigationAlertDismissed, _setDismissedAt]);

  // Monitor navigation time and update alert visibility
  useEffect(() => {
    if (lastActionTimestamp === null) return;

    const checkNavigationTime = () => {
      const now = Date.now();
      const timeSinceLastAction = now - lastActionTimestamp;

      // Show alert if threshold reached and not dismissed
      if (
        timeSinceLastAction >= PROLONGED_NAVIGATION_THRESHOLD_MS &&
        !isProlongedNavigationAlertDismissed
      ) {
        _setIsProlongedNavigationAlertVisible(true);
      } else {
        _setIsProlongedNavigationAlertVisible(false);
      }
    };

    // Check immediately
    checkNavigationTime();

    // Check every minute
    const intervalId = setInterval(checkNavigationTime, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [
    lastActionTimestamp,
    isProlongedNavigationAlertDismissed,
    _setIsProlongedNavigationAlertVisible,
  ]);

  /**
   * Record that user performed an action (subtask completion or focus start)
   * Resets the navigation timer
   */
  const recordUserAction = useCallback(() => {
    _setLastActionTimestamp(Date.now());
    _setIsProlongedNavigationAlertVisible(false);
    // Don't reset dismissed state - let dismiss expire naturally after 2h
  }, [_setLastActionTimestamp, _setIsProlongedNavigationAlertVisible]);

  /**
   * Dismiss the prolonged navigation alert
   * Hides the alert but keeps tracking navigation time
   * Dismiss expires after 2 hours
   */
  const dismissProlongedNavigationAlert = useCallback(() => {
    _setIsProlongedNavigationAlertVisible(false);
    _setIsProlongedNavigationAlertDismissed(true);
    _setDismissedAt(Date.now()); // Store current timestamp
  }, [
    _setIsProlongedNavigationAlertVisible,
    _setIsProlongedNavigationAlertDismissed,
    _setDismissedAt,
  ]);

  return {
    // State
    isProlongedNavigationAlertVisible,

    // Operations
    recordUserAction,
    dismissProlongedNavigationAlert,
  };
}
