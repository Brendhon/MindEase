import { useMissingBreakAlertContext } from "@/contexts/cognitive-alerts";
import {
  COGNITIVE_ALERT_DISMISS_EXPIRY_MS,
  MISSING_BREAK_SESSIONS_THRESHOLD
} from "@/utils/cognitive-alerts";
import { useCallback, useEffect } from "react";

/**
 * useMissingBreakAlert Hook - MindEase
 * 
 * Centralized hook for managing missing break alert state and business logic.
 * 
 * This hook handles:
 * - Tracking consecutive focus sessions without breaks
 * - Managing alert visibility based on business rules
 * - Resetting counters when breaks are taken or tasks are finished
 * 
 * The provider only manages basic state, while this hook handles all business logic.
 * 
 * @example
 * ```tsx
 * // Record focus session completion
 * function FocusSessionDialog() {
 *   const { recordFocusSessionComplete } = useMissingBreakAlert();
 *   
 *   const handleContinueFocus = () => {
 *     recordFocusSessionComplete();
 *     // ... other logic
 *   };
 * }
 * 
 * // Check alert visibility
 * function AlertsComponent() {
 *   const { isMissingBreakAlertVisible, dismissMissingBreakAlert } = useMissingBreakAlert();
 *   
 *   return (
 *     <Alert
 *       isVisible={isMissingBreakAlertVisible}
 *       onDismiss={dismissMissingBreakAlert}
 *     />
 *   );
 * }
 * ```
 * 
 * @throws Error if used outside MissingBreakAlertProvider
 */
export function useMissingBreakAlert() {
  const {
    consecutiveFocusSessions,
    isMissingBreakAlertVisible,
    isMissingBreakAlertDismissed,
    dismissedAt,
    _setConsecutiveFocusSessions,
    _setIsMissingBreakAlertVisible,
    _setIsMissingBreakAlertDismissed,
    _setDismissedAt,
  } = useMissingBreakAlertContext();

  // Check if dismiss has expired (2 hours)
  useEffect(() => {
    if (dismissedAt === null) return;

    const checkExpiry = () => {
      const now = Date.now();
      const timeSinceDismiss = now - dismissedAt;

      if (timeSinceDismiss >= COGNITIVE_ALERT_DISMISS_EXPIRY_MS) {
        // Dismiss expired - reset dismissed state
        _setIsMissingBreakAlertDismissed(false);
        _setDismissedAt(null);
      }
    };

    // Check immediately
    checkExpiry();

    // Check every minute to see if dismiss expired
    const intervalId = setInterval(checkExpiry, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, [dismissedAt, _setIsMissingBreakAlertDismissed, _setDismissedAt]);

  // Update alert visibility when consecutive sessions or dismissed state changes
  useEffect(() => {
    if (
      consecutiveFocusSessions >= MISSING_BREAK_SESSIONS_THRESHOLD &&
      !isMissingBreakAlertDismissed
    ) {
      _setIsMissingBreakAlertVisible(true);
    } else if (consecutiveFocusSessions < MISSING_BREAK_SESSIONS_THRESHOLD) {
      _setIsMissingBreakAlertVisible(false);
    }
  }, [consecutiveFocusSessions, isMissingBreakAlertDismissed, _setIsMissingBreakAlertVisible]);

  /**
   * Record that a focus session was completed without taking a break
   * Increments the counter (alert visibility is handled by useEffect)
   */
  const recordFocusSessionComplete = useCallback(() => {
    _setConsecutiveFocusSessions((prev) => prev + 1);
  }, [_setConsecutiveFocusSessions]);

  /**
   * Record that a break was completed
   * Resets the counter and hides the alert
   */
  const recordBreakComplete = useCallback(() => {
    _setConsecutiveFocusSessions(0);
    _setIsMissingBreakAlertVisible(false);
    _setIsMissingBreakAlertDismissed(false); // Allow alert to show again in the future
    _setDismissedAt(null); // Clear dismiss timestamp
  }, [_setConsecutiveFocusSessions, _setIsMissingBreakAlertVisible, _setIsMissingBreakAlertDismissed, _setDismissedAt]);

  /**
   * Record that a task was finished
   * Resets the counter (task finished = end of cycle)
   */
  const recordTaskFinished = useCallback(() => {
    _setConsecutiveFocusSessions(0);
    _setIsMissingBreakAlertVisible(false);
    _setIsMissingBreakAlertDismissed(false); // Allow alert to show again in the future
    _setDismissedAt(null); // Clear dismiss timestamp
  }, [_setConsecutiveFocusSessions, _setIsMissingBreakAlertVisible, _setIsMissingBreakAlertDismissed, _setDismissedAt]);

  /**
   * Dismiss the missing break alert
   * Hides the alert but keeps the counter (user still needs to take a break)
   * Dismiss expires after 2 hours
   */
  const dismissMissingBreakAlert = useCallback(() => {
    _setIsMissingBreakAlertVisible(false);
    _setIsMissingBreakAlertDismissed(true);
    _setDismissedAt(Date.now()); // Store current timestamp
  }, [_setIsMissingBreakAlertVisible, _setIsMissingBreakAlertDismissed, _setDismissedAt]);

  return {
    // State
    consecutiveFocusSessions,
    isMissingBreakAlertVisible,
    
    // Operations
    recordFocusSessionComplete,
    recordBreakComplete,
    recordTaskFinished,
    dismissMissingBreakAlert,
  };
}
